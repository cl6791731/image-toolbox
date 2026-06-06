/**
 * HEIC/HEIF decoder utility for Image Toolbox.
 * Strategy: native browser decode → libheif-js WASM → heic2any fallback.
 * Exposes global: decodeHeicFile(file) → Promise<File>
 */
(function () {
  function isHeic(file) {
    if (!file) return false;
    var name = (file.name || '').toLowerCase();
    if (name.endsWith('.heic') || name.endsWith('.heif')) return true;
    var type = (file.type || '').toLowerCase();
    if (type === 'image/heic' || type === 'image/heif' || type === 'application/heic') return true;
    return false;
  }

  function fileToUint8Array(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(new Uint8Array(reader.result)); };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  function blobToJpegFile(blob, filename) {
    var name = (filename || 'image').replace(/\.(heic|heif)$/i, '.jpg');
    return new File([blob], name, { type: 'image/jpeg' });
  }

  /** Try native browser decoding via blob URL → Image → canvas */
  function tryNativeDecode(file) {
    var url = URL.createObjectURL(file);
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) {
          if (b) resolve(blobToJpegFile(b, file.name));
          else reject(new Error('Canvas export failed'));
        }, 'image/jpeg', 0.92);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('Native decode failed'));
      };
      img.src = url;
    });
  }

  /** Decode HEIC using libheif-js v1.19.8 (newer libheif WASM, 1.39MB) */
  function tryLibheif(file) {
    return new Promise(function (resolve, reject) {
      if (window._libheifMod) { resolve(); return; }
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/libheif-js@1.19.8/libheif-wasm/libheif-bundle.js';
      script.async = true;
      script.onload = function () {
        try {
          window._libheifMod = libheif();
          if (typeof window._libheifMod.HeifDecoder !== 'function') {
            reject(new Error('HeifDecoder not found on module'));
            return;
          }
          resolve();
        } catch (e) { reject(e); }
      };
      script.onerror = function () { reject(new Error('libheif-js CDN load failed')); };
      document.head.appendChild(script);
    }).then(function () {
      return fileToUint8Array(file);
    }).then(function (data) {
      return new Promise(function (resolve, reject) {
        try {
          var decoder = new window._libheifMod.HeifDecoder();
          var images = decoder.decode(data);
          if (!images || images.length === 0) { reject(new Error('No images in HEIC')); return; }

          var image = images[0];
          var width = image.get_width();
          var height = image.get_height();
          var canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          image.display({ data: new Uint8ClampedArray(width * height * 4), width: width, height: height }, function (displayData) {
            if (!displayData) { reject(new Error('HEIF display failed')); return; }
            var ctx = canvas.getContext('2d');
            var imageData = ctx.createImageData(width, height);
            imageData.data.set(displayData.data);
            ctx.putImageData(imageData, 0, 0);
            canvas.toBlob(function (b) {
              if (b) resolve(blobToJpegFile(b, file.name));
              else reject(new Error('Canvas export failed'));
            }, 'image/jpeg', 0.92);
          });
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  /** Final fallback: heic2any (outdated libheif, may fail on newer profiles) */
  function tryHeic2any(file) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
      script.async = true;
      script.onload = function () {
        window.heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })
          .then(function (blob) { resolve(blobToJpegFile(blob, file.name)); })
          .catch(reject);
      };
      script.onerror = function () { reject(new Error('heic2any CDN failed')); };
      document.head.appendChild(script);
    });
  }

  window.decodeHeicFile = function (file) {
    if (!isHeic(file)) return Promise.resolve(file);

    return tryNativeDecode(file)
      .catch(function () {
        console.log('[heic] native decode failed, trying libheif-js...');
        return tryLibheif(file);
      })
      .catch(function (e) {
        console.log('[heic] libheif-js failed:', e.message, ', trying heic2any...');
        return tryHeic2any(file);
      })
      .catch(function (e) {
        console.log('[heic] all decoders failed:', e.message);
        alert('Unable to decode this HEIC file. Please convert it to JPG first:\n\n• iPhone: Settings → Camera → Formats → Most Compatible\n• Mac: Open in Preview → Export as JPEG');
        return file;
      });
  };
})();
