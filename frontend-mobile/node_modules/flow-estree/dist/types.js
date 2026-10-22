/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 * @generated
 */

/*
 * !!! GENERATED FILE !!!
 *
 * DESIGN NOTE — please read before editing.
 *
 * This file is a VERBATIM MIRROR of upstream
 *   xplat/static_h/tools/hermes-parser/js/hermes-estree/src/types.js
 * with our header swapped in. It is **not** schema-derived generation —
 * the body is byte-for-byte from upstream after the upstream header is
 * stripped. The `@generated` tag means "do not hand-edit" — to update,
 * edit upstream's types.js (or upstream the change first) and re-run the
 * regeneration command below.
 *
 * The codegen step ALSO performs a SCHEMA cross-check: every concrete
 * NodeDef in `node_kinds.rs` must have a matching `export interface` or
 * `export type` in upstream's types.js (or appear in
 * `KNOWN_TYPES_WITHOUT_INTERFACE` in codegen.rs with attribution). On any
 * drift, codegen FAILS the build with a non-zero exit and lists the
 * missing kinds. There is no synthesis or soft-warning path — upstream
 * already contains all Flow-only nodes today, so the cross-check exists
 * solely to prevent future drift between the Rust SCHEMA and upstream.
 *
 * Schema-derivable per-node interfaces are NOT independently generated
 * because upstream's interfaces carry hand-curated child unions (e.g.
 * `Expression`, `Statement`, `BindingName`, `MemberExpression` refinement
 * splits, `MethodDefinition` discriminator splits, per-property
 * nullability) that the Rust schema does not encode and should not encode
 * — the Rust schema is the source of truth for *binary serialization*
 * between the Rust parser and the JS deserializer; the upstream Flow
 * types are the source of truth for *consumer typings*. See
 * `generate_estree_types` in `flow_parser_wasm/src/bin/codegen.rs` for
 * the implementation.
 *
 * To regenerate (run from the fbsource root):
 *
 *   buck run fbcode//flow/rust_port/crates/flow_parser_wasm:codegen -- \
 *     --estree-types > \
 *     fbcode/flow/packages/flow-estree/src/types.js
 *
 * To regenerate against a different upstream copy, set
 * `HERMES_ESTREE_TYPES_JS` to an absolute path before invoking codegen.
 */

'use strict';

/**
 *
 * IMPORTANT NOTE
 *
 * This file intentionally uses interfaces and `readonly` fields.
 *
 * - `$ReadOnly` is an "evaluated" utility type in flow; meaning that flow does
 *    not actually calculate the resulting type until it is used. This creates
 *    a copy of the type at each usage site - ballooning memory and processing
 *    times.
 *    Usually this isn't a problem as a type might only be used one or two times
 *    - but in this giant circular-referencing graph that is the AST types, this
 *    causes check times for consumers to be awful.
 *
 *    Thus instead we manually annotate properties with `readonly` to avoid the `$ReadOnly` type.
 *
 * - `...Type` spreads do not preserve the readonly-ness of the properties. If
 *   we used object literal types then we would have to `$ReadOnly` all spreads
 *   (see point 1). On the other hand extending an interface does preserve
 *   readonlyness of properties.
 *
 *   Thus instead of object literals, we use interfaces.
 *
 *** Please ensure all properties are marked as readonly! ***
 */

/*
 * Token and Comment are pseudo-nodes to represent pieces of source code
 *
 * NOTE:
 * They are not included in the `ESNode` union below on purpose because they
 * are not ever included as part of the standard AST tree.
 */

// note: this is only ever present on Program.interpreter, never in the body

// Flow declares a "Node" type as part of its HTML typedefs.
// Because this file declares global types - we can't clash with it

// nodes that can be the direct parent of a statement
// nodes that can be the parent of a statement that store the statements in an array

// This is the complete type of a "Property"
// This same node (unfortunately) covers both object literal properties
// and object desturcturing properties.

// Private brand checks (#foo in bar) are a special case
// other binary expressions do not allow PrivateIdentifier in the left

// `PropertyDefinition` is the new standard for all class properties

/***********************
 * Flow specific nodes *
 ***********************/

// type T = { [[foo]]: number };

/*****************
 * Declare nodes *
 *****************/

/**********************
 * JSX specific nodes *
 **********************/

/************************************
 * Match expressions and statements *
 ************************************/

/******************
 * Match patterns *
 ******************/

/***********
 * Records *
 ***********/

/******************************************************
 * Deprecated spec nodes awaiting migration by Hermes *
 ******************************************************/
Object.defineProperty(exports, "__esModule", {
  value: true
});