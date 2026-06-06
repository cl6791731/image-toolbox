/**
 * HEIC/HEIF decoder utility for Image Toolbox.
 * Lazily loads heic2any from CDN only when a HEIC file is detected.
 * Exposes global: decodeHeicFile(file) → Promise<File>
 */
(function () {
  var _heic2anyLib = null;
  var _loading = null;

  function isHeic(file) {
    if (!file) return false;
    var name = (file.name || '').toLowerCase();
    if (name.endsWith('.heic') || name.endsWith('.heif')) return true;
    var type = (file.type || '').toLowerCase();
    if (type === 'image/heic' || type === 'image/heif' || type === 'application/heic') return true;
    return false;
  }

  function loadHeic2any() {
    if (_heic2anyLib) return Promise.resolve(_heic2anyLib);
    if (_loading) return _loading;
    _loading = new Promise(function (resolve, reject) {
      if (typeof heic2any !== 'undefined') {
        _heic2anyLib = heic2any;
        resolve(_heic2anyLib);
        return;
      }
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
      script.async = true;
      script.onload = function () {
        _heic2anyLib = window.heic2any;
        resolve(_heic2anyLib);
      };
      script.onerror = function () {
        reject(new Error('Failed to load HEIC decoder'));
      };
      document.head.appendChild(script);
    });
    return _loading;
  }

  /**
   * Decode a HEIC file to JPEG. Returns the original file if not HEIC.
   * @param {File} file
   * @returns {Promise<File>}
   */
  window.decodeHeicFile = function (file) {
    if (!isHeic(file)) return Promise.resolve(file);
    return loadHeic2any().then(function (heic2any) {
      return heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.92
      });
    }).then(function (blob) {
      var name = (file.name || 'image').replace(/\.(heic|heif)$/i, '.jpg');
      return new File([blob], name, { type: 'image/jpeg' });
    }).catch(function () {
      return file;
    });
  };
})();
