/// <reference path='../ui.mdl.ts' />

impakt.common.ui.service('_playPreview', [function() {

	var self = this;

	this.viewBox = '';

	this.setViewBox = function(x: number, y: number, width: number, height: number) {
		this.viewBox = [
			x, ' ',
			y, ' ',
			width, ' ',
			height
		].join('');
	}

	/**
	 * Compresses a SVG element into a string for storage.
	 * The SVG element is encoded into a base64 string before
	 * compression.
	 * @param {HTMLElement} svg The element to compress
	 */
	this.compress = function(svg: HTMLElement) {
		return Common.Utilities.compressSVG(svg);
	}

	/**
	 * Decompresses a compressed SVG element string; assumes
	 * the decompressed string is base64 encoded, so it decodes
	 * the decompressed string before returning the stringified SVG element.
	 * @param  {string} compressed The string to decmopress
	 * @return {string}            a stringified SVG element
	 */
	this.decompress = function(compressed: string): string {
		return Common.Utilities.decompressSVG(compressed);
	}

	function serialize(svg: HTMLElement): string {
		// take SVG HTML and convert into string
		return Common.Utilities.serializeXMLToString(svg);
	}

	function toBase64(svgString: string): string {
		return Common.Utilities.toBase64(svgString);
	}

	function fromBase64(base64Svg: string): string {
		return Common.Utilities.fromBase64(base64Svg);
	}
	
	function compress(svg: string): any {
		return Common.Utilities.compress(svg);
	}

	function decompress(compressed: string): string {
		return Common.Utilities.decompress(compressed);
	}
	
	
	/**
	 * TO-DO: store in local db
	 */


}]);