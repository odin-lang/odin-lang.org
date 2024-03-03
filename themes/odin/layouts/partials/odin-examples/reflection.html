package main

import "core:fmt"
import "core:reflect"

main :: proc() {
	Foo :: struct {
		x: int    `tag1`,
		y: string `json:"y_field"`,
		z: bool, // no tag
	}

	id := typeid_of(Foo)
	names := reflect.struct_field_names(id)
	types := reflect.struct_field_types(id)
	tags  := reflect.struct_field_tags(id)

	assert(len(names) == len(types) && len(names) == len(tags))

	fmt.println("Foo :: struct {")
	for tag, i in tags {
		name, type := names[i], types[i]
		if tag != "" {
			fmt.printf("\t%s: %T `%s`,\n", name, type, tag)
		} else {
			fmt.printf("\t%s: %T,\n", name, type)
		}
	}
	fmt.println("}")

	for tag, i in tags {
		if val, ok := reflect.struct_tag_lookup(tag, "json"); ok {
			fmt.printf("json: %s -> %s\n", names[i], val)
		}
	}
}