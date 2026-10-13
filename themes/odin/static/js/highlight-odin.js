"use strict";

/* Odin's grammar for highlight.js

Shared by this site and pkg.odin-lang.org. Load it after highlight.js, and before calling
`hljs.highlightAll()`.

pkg.odin-lang.org highlights every builtin it documents, so a page may set
`window.odinHighlightExtras` before loading this to add space separated lists of words:

    window.odinHighlightExtras = {built_in: "ensure ...", type: "int ...", literal: "..."};
*/

hljs.registerLanguage("odin", function(e) {
	const extras = window.odinHighlightExtras || {};
	const words = s => (s || "").split(/\s+/).filter(w => w !== "");

	const keyword = words(
		"asm auto_cast bit_field bit_set break case cast context continue defer distinct do dynamic else enum " +
		"fallthrough for foreign if import in map matrix not_in or_break or_continue or_else or_return package proc " +
		"return struct switch transmute type_of typeid union using when where"
	);
	const literal = words("true false nil " + (extras.literal || ""));
	const type = words(extras.type);
	// a word given as a type is not also a built_in, as highlight.js would pick either
	const built_in = words(
		"abs align_of cap clamp complex compress_values conj expand_values imag jmag kmag len max min offset_of " +
		"offset_of_by_string quaternion raw_data real size_of soa_unzip soa_zip swizzle type_info_of type_of typeid_of unreachable " +
		"int uint uintptr rawptr any " +
		"u8 u16 u32 u64 u128 i8 i16 i32 i64 i128 " +
		"u16le u32le u64le u128le i16le i32le i64le i128le " +
		"u16be u32be u64be u128be i16be i32be i64be i128be " +
		"f16 f32 f64 f16le f32le f64le f16be f32be f64be " +
		"bool b8 b16 b32 b64 " +
		"string cstring string16 cstring16 byte rune " +
		"complex32 complex64 complex128 quaternion64 quaternion128 quaternion256 " +
		(extras.built_in || "")
	).filter(w => !type.includes(w));

	return {
		name: "Odin",
		aliases: ["odin", "odinlang", "odin-lang"],
		keywords: {keyword, literal, built_in, type},
		illegal: "</",
		contains: [
			e.C_LINE_COMMENT_MODE,
			// block comments nest in Odin
			e.COMMENT("/\\*", "\\*/", {contains: ["self"]}),
			{
				className: "string",
				variants: [
					// multi-line strings must be tried before the single quote forms
					{begin: '"""', end: '"""', contains: [e.BACKSLASH_ESCAPE]},
					{begin: "```", end: "```"},
					{begin: '"', end: '"', illegal: "\\n", contains: [e.BACKSLASH_ESCAPE]},
					{begin: "`", end: "`"},
					{begin: "'", end: "'", illegal: "\\n", contains: [e.BACKSLASH_ESCAPE]}
				]
			},
			// file tags, e.g. `#+build windows`, take the rest of their line
			{className: "meta", begin: "#\\+", end: "$"},
			// directives, e.g. `#partial`, `#soa`, `#assert`
			{className: "meta", begin: "#[A-Za-z_]\\w*"},
			// attributes, e.g. `@(require_results)`, `@(link_name="foo")`, `@private`
			{className: "meta", begin: "@\\(", end: "\\)", contains: [{className: "string", begin: '"', end: '"', contains: [e.BACKSLASH_ESCAPE]}]},
			{className: "meta", begin: "@[A-Za-z_]\\w*"},
			{
				className: "number",
				relevance: 0,
				variants: [
					// 0b binary, 0o octal, 0d decimal, 0z dozenal, 0x hexadecimal, 0h hexadecimal float
					{begin: "\\b0[bodzxh][0-9a-fA-F_]+[ijk]?"},
					// the `.` is not taken when it starts a range, e.g. `0..<10`
					{begin: "\\b[0-9][0-9_]*(\\.(?!\\.)[0-9_]*)?([eE][-+]?[0-9_]+)?[ijk]?"}
				]
			}
		]
	};
});
