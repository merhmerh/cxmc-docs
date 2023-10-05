var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key2, value) => {
  __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// .svelte-kit/output/server/chunks/ssr.js
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
function set_current_component(component20) {
  current_component = component20;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component20 = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component20.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(
        /** @type {string} */
        type,
        detail,
        { cancelable }
      );
      callbacks.slice().forEach((fn) => {
        fn.call(component20, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
  return context;
}
function getContext(key2) {
  return get_current_component().$$.context.get(key2);
}
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function spread(args, attrs_to_add) {
  const attributes = Object.assign({}, ...args);
  if (attrs_to_add) {
    const classes_to_add = attrs_to_add.classes;
    const styles_to_add = attrs_to_add.styles;
    if (classes_to_add) {
      if (attributes.class == null) {
        attributes.class = classes_to_add;
      } else {
        attributes.class += " " + classes_to_add;
      }
    }
    if (styles_to_add) {
      if (attributes.style == null) {
        attributes.style = style_object_to_string(styles_to_add);
      } else {
        attributes.style = style_object_to_string(
          merge_ssr_styles(attributes.style, styles_to_add)
        );
      }
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
function merge_ssr_styles(style_attribute, style_directive) {
  const style_object = {};
  for (const individual_style of style_attribute.split(";")) {
    const colon_index = individual_style.indexOf(":");
    const name = individual_style.slice(0, colon_index).trim();
    const value = individual_style.slice(colon_index + 1).trim();
    if (!name)
      continue;
    style_object[name] = value;
  }
  for (const name in style_directive) {
    const value = style_directive[name];
    if (value) {
      style_object[name] = value;
    } else {
      delete style_object[name];
    }
  }
  return style_object;
}
function escape(value, is_attr = false) {
  const str = String(value);
  const pattern2 = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern2.lastIndex = 0;
  let escaped2 = "";
  let last = 0;
  while (pattern2.test(str)) {
    const i = pattern2.lastIndex - 1;
    const ch = str[i];
    escaped2 += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped2 + str.substring(last);
}
function escape_attribute_value(value) {
  const should_escape = typeof value === "string" || value && typeof value === "object";
  return should_escape ? escape(value, true) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key2 in obj) {
    result[key2] = escape_attribute_value(obj[key2]);
  }
  return result;
}
function each(items, fn) {
  items = ensure_array_like(items);
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
function validate_component(component20, name) {
  if (!component20 || !component20.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(
      `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`
    );
  }
  return component20;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      // these will be immediately discarded
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css22) => css22.code).join("\n"),
          map: null
          // TODO
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  const assignment = boolean && value === true ? "" : `="${escape(value, true)}"`;
  return ` ${name}${assignment}`;
}
function style_object_to_string(style_object) {
  return Object.keys(style_object).filter((key2) => style_object[key2]).map((key2) => `${key2}: ${escape_attribute_value(style_object[key2])};`).join(" ");
}
var current_component, _boolean_attributes, boolean_attributes, invalid_attribute_name_character, ATTR_REGEX, CONTENT_REGEX, missing_component, on_destroy;
var init_ssr = __esm({
  ".svelte-kit/output/server/chunks/ssr.js"() {
    _boolean_attributes = /** @type {const} */
    [
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "hidden",
      "inert",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected"
    ];
    boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);
    invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
    ATTR_REGEX = /[&"]/g;
    CONTENT_REGEX = /[&<]/g;
    missing_component = {
      $$render: () => ""
    };
  }
});

// .svelte-kit/output/server/chunks/public.js
var PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY;
var init_public = __esm({
  ".svelte-kit/output/server/chunks/public.js"() {
    PUBLIC_SUPABASE_URL = "https://cksvrtqduesomnciaajt.supabase.co";
    PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc3ZydHFkdWVzb21uY2lhYWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3NTY3ODYsImV4cCI6MjAwMDMzMjc4Nn0.KQ3xYh7gN3TYlyPTJVjZDOJ30z-JigsQHbs45SBVxMs";
  }
});

// .svelte-kit/output/server/chunks/private.js
var SUPABASE_SERVICE_KEY, AIRTABLE_BASEID, AIRTABLE_TOKEN;
var init_private = __esm({
  ".svelte-kit/output/server/chunks/private.js"() {
    SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc3ZydHFkdWVzb21uY2lhYWp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NDc1Njc4NiwiZXhwIjoyMDAwMzMyNzg2fQ.M_iNVMCQWBzPoQPnFV3fA8BkvEsB1f-XcSAR_vY82Lg";
    AIRTABLE_BASEID = "https://api.airtable.com/v0/app2mZFfxFuIbH8qR";
    AIRTABLE_TOKEN = "patq2GO742J5hGho4.06d4e42114a8baf4e121ee547db8dbb0a21b09a99b5d8f3f451fa9de27779962";
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/webcrypto.js
var webcrypto_default;
var init_webcrypto = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/webcrypto.js"() {
    webcrypto_default = crypto;
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/digest.js
var init_digest = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/digest.js"() {
    init_webcrypto();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/buffer_utils.js
var encoder, decoder, MAX_INT32;
var init_buffer_utils = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/buffer_utils.js"() {
    init_digest();
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    MAX_INT32 = 2 ** 32;
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/base64url.js
var encodeBase64, encode, decodeBase64, decode;
var init_base64url = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/base64url.js"() {
    init_buffer_utils();
    encodeBase64 = (input) => {
      let unencoded = input;
      if (typeof unencoded === "string") {
        unencoded = encoder.encode(unencoded);
      }
      const CHUNK_SIZE = 32768;
      const arr = [];
      for (let i = 0; i < unencoded.length; i += CHUNK_SIZE) {
        arr.push(String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)));
      }
      return btoa(arr.join(""));
    };
    encode = (input) => {
      return encodeBase64(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    };
    decodeBase64 = (encoded) => {
      const binary = atob(encoded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    };
    decode = (input) => {
      let encoded = input;
      if (encoded instanceof Uint8Array) {
        encoded = decoder.decode(encoded);
      }
      encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
      try {
        return decodeBase64(encoded);
      } catch (_a) {
        throw new TypeError("The input to be decoded is not correctly encoded.");
      }
    };
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/util/errors.js
var init_errors = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/util/errors.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/random.js
var random_default;
var init_random = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/random.js"() {
    init_webcrypto();
    random_default = webcrypto_default.getRandomValues.bind(webcrypto_default);
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/iv.js
var init_iv = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/iv.js"() {
    init_errors();
    init_random();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/check_iv_length.js
var init_check_iv_length = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/check_iv_length.js"() {
    init_errors();
    init_iv();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/check_cek_length.js
var init_check_cek_length = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/check_cek_length.js"() {
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/timing_safe_equal.js
var init_timing_safe_equal = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/timing_safe_equal.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/crypto_key.js
var init_crypto_key = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/crypto_key.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/invalid_key_input.js
var init_invalid_key_input = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/invalid_key_input.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/is_key_like.js
var init_is_key_like = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/is_key_like.js"() {
    init_webcrypto();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/decrypt.js
var init_decrypt = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/decrypt.js"() {
    init_buffer_utils();
    init_check_iv_length();
    init_check_cek_length();
    init_timing_safe_equal();
    init_errors();
    init_webcrypto();
    init_crypto_key();
    init_invalid_key_input();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/zlib.js
var init_zlib = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/zlib.js"() {
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/is_disjoint.js
var init_is_disjoint = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/is_disjoint.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/is_object.js
var init_is_object = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/is_object.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/bogus.js
var init_bogus = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/bogus.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/aeskw.js
var init_aeskw = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/aeskw.js"() {
    init_bogus();
    init_webcrypto();
    init_crypto_key();
    init_invalid_key_input();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/ecdhes.js
var init_ecdhes = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/ecdhes.js"() {
    init_buffer_utils();
    init_webcrypto();
    init_crypto_key();
    init_invalid_key_input();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/check_p2s.js
var init_check_p2s = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/check_p2s.js"() {
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/pbes2kw.js
var init_pbes2kw = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/pbes2kw.js"() {
    init_random();
    init_buffer_utils();
    init_base64url();
    init_aeskw();
    init_check_p2s();
    init_webcrypto();
    init_crypto_key();
    init_invalid_key_input();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/subtle_rsaes.js
var init_subtle_rsaes = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/subtle_rsaes.js"() {
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/check_key_length.js
var init_check_key_length = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/check_key_length.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/rsaes.js
var init_rsaes = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/rsaes.js"() {
    init_subtle_rsaes();
    init_bogus();
    init_webcrypto();
    init_crypto_key();
    init_check_key_length();
    init_invalid_key_input();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/cek.js
var init_cek = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/cek.js"() {
    init_errors();
    init_random();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/format_pem.js
var init_format_pem = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/format_pem.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/asn1.js
var init_asn1 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/asn1.js"() {
    init_webcrypto();
    init_invalid_key_input();
    init_base64url();
    init_format_pem();
    init_errors();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/jwk_to_key.js
var init_jwk_to_key = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/jwk_to_key.js"() {
    init_webcrypto();
    init_errors();
    init_base64url();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/key/import.js
var init_import = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/key/import.js"() {
    init_base64url();
    init_asn1();
    init_jwk_to_key();
    init_errors();
    init_is_object();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/check_key_type.js
var init_check_key_type = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/check_key_type.js"() {
    init_invalid_key_input();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/encrypt.js
var init_encrypt = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/encrypt.js"() {
    init_buffer_utils();
    init_check_iv_length();
    init_check_cek_length();
    init_webcrypto();
    init_crypto_key();
    init_invalid_key_input();
    init_errors();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/aesgcmkw.js
var init_aesgcmkw = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/aesgcmkw.js"() {
    init_encrypt();
    init_decrypt();
    init_iv();
    init_base64url();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/decrypt_key_management.js
var init_decrypt_key_management = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/decrypt_key_management.js"() {
    init_aeskw();
    init_ecdhes();
    init_pbes2kw();
    init_rsaes();
    init_base64url();
    init_errors();
    init_cek();
    init_import();
    init_check_key_type();
    init_is_object();
    init_aesgcmkw();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/validate_crit.js
var init_validate_crit = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/validate_crit.js"() {
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/validate_algorithms.js
var init_validate_algorithms = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/validate_algorithms.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/flattened/decrypt.js
var init_decrypt2 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/flattened/decrypt.js"() {
    init_base64url();
    init_decrypt();
    init_zlib();
    init_errors();
    init_is_disjoint();
    init_is_object();
    init_decrypt_key_management();
    init_buffer_utils();
    init_cek();
    init_validate_crit();
    init_validate_algorithms();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/compact/decrypt.js
var init_decrypt3 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/compact/decrypt.js"() {
    init_decrypt2();
    init_errors();
    init_buffer_utils();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/general/decrypt.js
var init_decrypt4 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/general/decrypt.js"() {
    init_decrypt2();
    init_errors();
    init_is_object();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/key_to_jwk.js
var init_key_to_jwk = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/key_to_jwk.js"() {
    init_webcrypto();
    init_invalid_key_input();
    init_base64url();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/key/export.js
var init_export = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/key/export.js"() {
    init_asn1();
    init_asn1();
    init_key_to_jwk();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/encrypt_key_management.js
var init_encrypt_key_management = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/encrypt_key_management.js"() {
    init_aeskw();
    init_ecdhes();
    init_pbes2kw();
    init_rsaes();
    init_base64url();
    init_cek();
    init_errors();
    init_export();
    init_check_key_type();
    init_aesgcmkw();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/flattened/encrypt.js
var unprotected;
var init_encrypt2 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/flattened/encrypt.js"() {
    init_base64url();
    init_encrypt();
    init_zlib();
    init_iv();
    init_encrypt_key_management();
    init_errors();
    init_is_disjoint();
    init_buffer_utils();
    init_validate_crit();
    unprotected = Symbol();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/general/encrypt.js
var init_encrypt3 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/general/encrypt.js"() {
    init_encrypt2();
    init_errors();
    init_cek();
    init_is_disjoint();
    init_encrypt_key_management();
    init_base64url();
    init_validate_crit();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/subtle_dsa.js
var init_subtle_dsa = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/subtle_dsa.js"() {
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/get_sign_verify_key.js
var init_get_sign_verify_key = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/get_sign_verify_key.js"() {
    init_webcrypto();
    init_crypto_key();
    init_invalid_key_input();
    init_is_key_like();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/verify.js
var init_verify = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/verify.js"() {
    init_subtle_dsa();
    init_webcrypto();
    init_check_key_length();
    init_get_sign_verify_key();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/flattened/verify.js
var init_verify2 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/flattened/verify.js"() {
    init_base64url();
    init_verify();
    init_errors();
    init_buffer_utils();
    init_is_disjoint();
    init_is_object();
    init_check_key_type();
    init_validate_crit();
    init_validate_algorithms();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/compact/verify.js
var init_verify3 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/compact/verify.js"() {
    init_verify2();
    init_errors();
    init_buffer_utils();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/general/verify.js
var init_verify4 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/general/verify.js"() {
    init_verify2();
    init_errors();
    init_is_object();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/epoch.js
var init_epoch = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/epoch.js"() {
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/secs.js
var minute, hour, day, week, year;
var init_secs = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/secs.js"() {
    minute = 60;
    hour = minute * 60;
    day = hour * 24;
    week = day * 7;
    year = day * 365.25;
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/jwt_claims_set.js
var init_jwt_claims_set = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/lib/jwt_claims_set.js"() {
    init_errors();
    init_buffer_utils();
    init_epoch();
    init_secs();
    init_is_object();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/verify.js
var init_verify5 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/verify.js"() {
    init_verify3();
    init_jwt_claims_set();
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/decrypt.js
var init_decrypt5 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/decrypt.js"() {
    init_decrypt3();
    init_jwt_claims_set();
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/compact/encrypt.js
var init_encrypt4 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwe/compact/encrypt.js"() {
    init_encrypt2();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/sign.js
var init_sign = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/sign.js"() {
    init_subtle_dsa();
    init_webcrypto();
    init_check_key_length();
    init_get_sign_verify_key();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/flattened/sign.js
var init_sign2 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/flattened/sign.js"() {
    init_base64url();
    init_sign();
    init_is_disjoint();
    init_errors();
    init_buffer_utils();
    init_check_key_type();
    init_validate_crit();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/compact/sign.js
var init_sign3 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/compact/sign.js"() {
    init_sign2();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/general/sign.js
var init_sign4 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jws/general/sign.js"() {
    init_sign2();
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/produce.js
var init_produce = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/produce.js"() {
    init_epoch();
    init_is_object();
    init_secs();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/sign.js
var init_sign5 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/sign.js"() {
    init_sign3();
    init_errors();
    init_buffer_utils();
    init_produce();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/encrypt.js
var init_encrypt5 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/encrypt.js"() {
    init_encrypt4();
    init_buffer_utils();
    init_produce();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwk/thumbprint.js
var init_thumbprint = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwk/thumbprint.js"() {
    init_digest();
    init_base64url();
    init_errors();
    init_buffer_utils();
    init_is_object();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwk/embedded.js
var init_embedded = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwk/embedded.js"() {
    init_import();
    init_is_object();
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwks/local.js
var init_local = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwks/local.js"() {
    init_import();
    init_errors();
    init_is_object();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/fetch_jwks.js
var init_fetch_jwks = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/fetch_jwks.js"() {
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwks/remote.js
var init_remote = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwks/remote.js"() {
    init_fetch_jwks();
    init_errors();
    init_local();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/unsecured.js
var init_unsecured = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/jwt/unsecured.js"() {
    init_base64url();
    init_buffer_utils();
    init_errors();
    init_jwt_claims_set();
    init_produce();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/util/base64url.js
var base64url_exports2 = {};
__export(base64url_exports2, {
  decode: () => decode2,
  encode: () => encode2
});
var encode2, decode2;
var init_base64url2 = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/util/base64url.js"() {
    init_base64url();
    encode2 = encode;
    decode2 = decode;
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/util/decode_protected_header.js
var init_decode_protected_header = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/util/decode_protected_header.js"() {
    init_base64url2();
    init_buffer_utils();
    init_is_object();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/util/decode_jwt.js
var init_decode_jwt = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/util/decode_jwt.js"() {
    init_base64url2();
    init_buffer_utils();
    init_is_object();
    init_errors();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/generate.js
var init_generate = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/runtime/generate.js"() {
    init_webcrypto();
    init_errors();
    init_random();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/key/generate_key_pair.js
var init_generate_key_pair = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/key/generate_key_pair.js"() {
    init_generate();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/key/generate_secret.js
var init_generate_secret = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/key/generate_secret.js"() {
    init_generate();
  }
});

// node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/index.js
var init_browser = __esm({
  "node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/browser/index.js"() {
    init_decrypt3();
    init_decrypt2();
    init_decrypt4();
    init_encrypt3();
    init_verify3();
    init_verify2();
    init_verify4();
    init_verify5();
    init_decrypt5();
    init_encrypt4();
    init_encrypt2();
    init_sign3();
    init_sign2();
    init_sign4();
    init_sign5();
    init_encrypt5();
    init_thumbprint();
    init_embedded();
    init_local();
    init_remote();
    init_unsecured();
    init_export();
    init_import();
    init_decode_protected_header();
    init_decode_jwt();
    init_errors();
    init_generate_key_pair();
    init_generate_secret();
    init_base64url2();
  }
});

// node_modules/.pnpm/@supabase+node-fetch@2.6.14/node_modules/@supabase/node-fetch/browser.js
var require_browser = __commonJS({
  "node_modules/.pnpm/@supabase+node-fetch@2.6.14/node_modules/@supabase/node-fetch/browser.js"(exports, module) {
    "use strict";
    var getGlobal = function() {
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      throw new Error("unable to locate global object");
    };
    var globalObject = getGlobal();
    module.exports = exports = globalObject.fetch;
    if (globalObject.fetch) {
      exports.default = globalObject.fetch.bind(globalObject);
    }
    exports.Headers = globalObject.Headers;
    exports.Request = globalObject.Request;
    exports.Response = globalObject.Response;
  }
});

// node_modules/.pnpm/@supabase+functions-js@2.1.5/node_modules/@supabase/functions-js/dist/module/helper.js
var resolveFetch;
var init_helper = __esm({
  "node_modules/.pnpm/@supabase+functions-js@2.1.5/node_modules/@supabase/functions-js/dist/module/helper.js"() {
    resolveFetch = (customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = (...args) => Promise.resolve().then(() => __toESM(require_browser())).then(({ default: fetch2 }) => fetch2(...args));
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    };
  }
});

// node_modules/.pnpm/@supabase+functions-js@2.1.5/node_modules/@supabase/functions-js/dist/module/types.js
var FunctionsError, FunctionsFetchError, FunctionsRelayError, FunctionsHttpError;
var init_types = __esm({
  "node_modules/.pnpm/@supabase+functions-js@2.1.5/node_modules/@supabase/functions-js/dist/module/types.js"() {
    FunctionsError = class extends Error {
      constructor(message, name = "FunctionsError", context) {
        super(message);
        this.name = name;
        this.context = context;
      }
    };
    FunctionsFetchError = class extends FunctionsError {
      constructor(context) {
        super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
      }
    };
    FunctionsRelayError = class extends FunctionsError {
      constructor(context) {
        super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
      }
    };
    FunctionsHttpError = class extends FunctionsError {
      constructor(context) {
        super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
      }
    };
  }
});

// node_modules/.pnpm/@supabase+functions-js@2.1.5/node_modules/@supabase/functions-js/dist/module/FunctionsClient.js
var __awaiter, FunctionsClient;
var init_FunctionsClient = __esm({
  "node_modules/.pnpm/@supabase+functions-js@2.1.5/node_modules/@supabase/functions-js/dist/module/FunctionsClient.js"() {
    init_helper();
    init_types();
    __awaiter = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    FunctionsClient = class {
      constructor(url, { headers = {}, customFetch } = {}) {
        this.url = url;
        this.headers = headers;
        this.fetch = resolveFetch(customFetch);
      }
      /**
       * Updates the authorization header
       * @param token - the new jwt token sent in the authorisation header
       */
      setAuth(token) {
        this.headers.Authorization = `Bearer ${token}`;
      }
      /**
       * Invokes a function
       * @param functionName - The name of the Function to invoke.
       * @param options - Options for invoking the Function.
       */
      invoke(functionName, options2 = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const { headers, method, body: functionArgs } = options2;
            let _headers = {};
            let body;
            if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, "Content-Type") || !headers)) {
              if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
                _headers["Content-Type"] = "application/octet-stream";
                body = functionArgs;
              } else if (typeof functionArgs === "string") {
                _headers["Content-Type"] = "text/plain";
                body = functionArgs;
              } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
                body = functionArgs;
              } else {
                _headers["Content-Type"] = "application/json";
                body = JSON.stringify(functionArgs);
              }
            }
            const response = yield this.fetch(`${this.url}/${functionName}`, {
              method: method || "POST",
              // headers priority is (high to low):
              // 1. invoke-level headers
              // 2. client-level headers
              // 3. default Content-Type header
              headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
              body
            }).catch((fetchError) => {
              throw new FunctionsFetchError(fetchError);
            });
            const isRelayError = response.headers.get("x-relay-error");
            if (isRelayError && isRelayError === "true") {
              throw new FunctionsRelayError(response);
            }
            if (!response.ok) {
              throw new FunctionsHttpError(response);
            }
            let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim();
            let data;
            if (responseType === "application/json") {
              data = yield response.json();
            } else if (responseType === "application/octet-stream") {
              data = yield response.blob();
            } else if (responseType === "multipart/form-data") {
              data = yield response.formData();
            } else {
              data = yield response.text();
            }
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
    };
  }
});

// node_modules/.pnpm/@supabase+functions-js@2.1.5/node_modules/@supabase/functions-js/dist/module/index.js
var init_module = __esm({
  "node_modules/.pnpm/@supabase+functions-js@2.1.5/node_modules/@supabase/functions-js/dist/module/index.js"() {
    init_FunctionsClient();
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestBuilder.js
var import_node_fetch, PostgrestBuilder;
var init_PostgrestBuilder = __esm({
  "node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestBuilder.js"() {
    import_node_fetch = __toESM(require_browser());
    PostgrestBuilder = class {
      constructor(builder) {
        this.shouldThrowOnError = false;
        this.method = builder.method;
        this.url = builder.url;
        this.headers = builder.headers;
        this.schema = builder.schema;
        this.body = builder.body;
        this.shouldThrowOnError = builder.shouldThrowOnError;
        this.signal = builder.signal;
        this.isMaybeSingle = builder.isMaybeSingle;
        if (builder.fetch) {
          this.fetch = builder.fetch;
        } else if (typeof fetch === "undefined") {
          this.fetch = import_node_fetch.default;
        } else {
          this.fetch = fetch;
        }
      }
      /**
       * If there's an error with the query, throwOnError will reject the promise by
       * throwing the error instead of returning it as part of a successful response.
       *
       * {@link https://github.com/supabase/supabase-js/issues/92}
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      then(onfulfilled, onrejected) {
        if (this.schema === void 0) {
        } else if (["GET", "HEAD"].includes(this.method)) {
          this.headers["Accept-Profile"] = this.schema;
        } else {
          this.headers["Content-Profile"] = this.schema;
        }
        if (this.method !== "GET" && this.method !== "HEAD") {
          this.headers["Content-Type"] = "application/json";
        }
        const _fetch = this.fetch;
        let res = _fetch(this.url.toString(), {
          method: this.method,
          headers: this.headers,
          body: JSON.stringify(this.body),
          signal: this.signal
        }).then(async (res2) => {
          var _a, _b, _c;
          let error2 = null;
          let data = null;
          let count = null;
          let status = res2.status;
          let statusText = res2.statusText;
          if (res2.ok) {
            if (this.method !== "HEAD") {
              const body = await res2.text();
              if (body === "") {
              } else if (this.headers["Accept"] === "text/csv") {
                data = body;
              } else if (this.headers["Accept"] && this.headers["Accept"].includes("application/vnd.pgrst.plan+text")) {
                data = body;
              } else {
                data = JSON.parse(body);
              }
            }
            const countHeader = (_a = this.headers["Prefer"]) === null || _a === void 0 ? void 0 : _a.match(/count=(exact|planned|estimated)/);
            const contentRange = (_b = res2.headers.get("content-range")) === null || _b === void 0 ? void 0 : _b.split("/");
            if (countHeader && contentRange && contentRange.length > 1) {
              count = parseInt(contentRange[1]);
            }
            if (this.isMaybeSingle && this.method === "GET" && Array.isArray(data)) {
              if (data.length > 1) {
                error2 = {
                  // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
                  code: "PGRST116",
                  details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                  hint: null,
                  message: "JSON object requested, multiple (or no) rows returned"
                };
                data = null;
                count = null;
                status = 406;
                statusText = "Not Acceptable";
              } else if (data.length === 1) {
                data = data[0];
              } else {
                data = null;
              }
            }
          } else {
            const body = await res2.text();
            try {
              error2 = JSON.parse(body);
              if (Array.isArray(error2) && res2.status === 404) {
                data = [];
                error2 = null;
                status = 200;
                statusText = "OK";
              }
            } catch (_d) {
              if (res2.status === 404 && body === "") {
                status = 204;
                statusText = "No Content";
              } else {
                error2 = {
                  message: body
                };
              }
            }
            if (error2 && this.isMaybeSingle && ((_c = error2 === null || error2 === void 0 ? void 0 : error2.details) === null || _c === void 0 ? void 0 : _c.includes("Results contain 0 rows"))) {
              error2 = null;
              status = 200;
              statusText = "OK";
            }
            if (error2 && this.shouldThrowOnError) {
              throw error2;
            }
          }
          const postgrestResponse = {
            error: error2,
            data,
            count,
            status,
            statusText
          };
          return postgrestResponse;
        });
        if (!this.shouldThrowOnError) {
          res = res.catch((fetchError) => {
            var _a, _b, _c;
            return {
              error: {
                message: `${(_a = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _a !== void 0 ? _a : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
                details: `${(_b = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _b !== void 0 ? _b : ""}`,
                hint: "",
                code: `${(_c = fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) !== null && _c !== void 0 ? _c : ""}`
              },
              data: null,
              count: null,
              status: 0,
              statusText: ""
            };
          });
        }
        return res.then(onfulfilled, onrejected);
      }
    };
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestTransformBuilder.js
var PostgrestTransformBuilder;
var init_PostgrestTransformBuilder = __esm({
  "node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestTransformBuilder.js"() {
    init_PostgrestBuilder();
    PostgrestTransformBuilder = class extends PostgrestBuilder {
      /**
       * Perform a SELECT on the query result.
       *
       * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
       * return modified rows. By calling this method, modified rows are returned in
       * `data`.
       *
       * @param columns - The columns to retrieve, separated by commas
       */
      select(columns) {
        let quoted2 = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted2) {
            return "";
          }
          if (c === '"') {
            quoted2 = !quoted2;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        if (this.headers["Prefer"]) {
          this.headers["Prefer"] += ",";
        }
        this.headers["Prefer"] += "return=representation";
        return this;
      }
      /**
       * Order the query result by `column`.
       *
       * You can call this method multiple times to order by multiple columns.
       *
       * You can order foreign tables, but it doesn't affect the ordering of the
       * current table.
       *
       * @param column - The column to order by
       * @param options - Named parameters
       * @param options.ascending - If `true`, the result will be in ascending order
       * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
       * `null`s appear last.
       * @param options.foreignTable - Set this to order a foreign table by foreign
       * columns
       */
      order(column, { ascending = true, nullsFirst, foreignTable } = {}) {
        const key2 = foreignTable ? `${foreignTable}.order` : "order";
        const existingOrder = this.url.searchParams.get(key2);
        this.url.searchParams.set(key2, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
        return this;
      }
      /**
       * Limit the query result by `count`.
       *
       * @param count - The maximum number of rows to return
       * @param options - Named parameters
       * @param options.foreignTable - Set this to limit rows of foreign tables
       * instead of the current table
       */
      limit(count, { foreignTable } = {}) {
        const key2 = typeof foreignTable === "undefined" ? "limit" : `${foreignTable}.limit`;
        this.url.searchParams.set(key2, `${count}`);
        return this;
      }
      /**
       * Limit the query result by starting at an offset (`from`) and ending at the offset (`from + to`).
       * Only records within this range are returned.
       * This respects the query order and if there is no order clause the range could behave unexpectedly.
       * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
       * and fourth rows of the query.
       *
       * @param from - The starting index from which to limit the result
       * @param to - The last index to which to limit the result
       * @param options - Named parameters
       * @param options.foreignTable - Set this to limit rows of foreign tables
       * instead of the current table
       */
      range(from, to, { foreignTable } = {}) {
        const keyOffset = typeof foreignTable === "undefined" ? "offset" : `${foreignTable}.offset`;
        const keyLimit = typeof foreignTable === "undefined" ? "limit" : `${foreignTable}.limit`;
        this.url.searchParams.set(keyOffset, `${from}`);
        this.url.searchParams.set(keyLimit, `${to - from + 1}`);
        return this;
      }
      /**
       * Set the AbortSignal for the fetch request.
       *
       * @param signal - The AbortSignal to use for the fetch request
       */
      abortSignal(signal) {
        this.signal = signal;
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be one row (e.g. using `.limit(1)`), otherwise this
       * returns an error.
       */
      single() {
        this.headers["Accept"] = "application/vnd.pgrst.object+json";
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
       * this returns an error.
       */
      maybeSingle() {
        if (this.method === "GET") {
          this.headers["Accept"] = "application/json";
        } else {
          this.headers["Accept"] = "application/vnd.pgrst.object+json";
        }
        this.isMaybeSingle = true;
        return this;
      }
      /**
       * Return `data` as a string in CSV format.
       */
      csv() {
        this.headers["Accept"] = "text/csv";
        return this;
      }
      /**
       * Return `data` as an object in [GeoJSON](https://geojson.org) format.
       */
      geojson() {
        this.headers["Accept"] = "application/geo+json";
        return this;
      }
      /**
       * Return `data` as the EXPLAIN plan for the query.
       *
       * @param options - Named parameters
       *
       * @param options.analyze - If `true`, the query will be executed and the
       * actual run time will be returned
       *
       * @param options.verbose - If `true`, the query identifier will be returned
       * and `data` will include the output columns of the query
       *
       * @param options.settings - If `true`, include information on configuration
       * parameters that affect query planning
       *
       * @param options.buffers - If `true`, include information on buffer usage
       *
       * @param options.wal - If `true`, include information on WAL record generation
       *
       * @param options.format - The format of the output, can be `"text"` (default)
       * or `"json"`
       */
      explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
        const options2 = [
          analyze ? "analyze" : null,
          verbose ? "verbose" : null,
          settings ? "settings" : null,
          buffers ? "buffers" : null,
          wal ? "wal" : null
        ].filter(Boolean).join("|");
        const forMediatype = this.headers["Accept"];
        this.headers["Accept"] = `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options2};`;
        if (format === "json")
          return this;
        else
          return this;
      }
      /**
       * Rollback the query.
       *
       * `data` will still be returned, but the query is not committed.
       */
      rollback() {
        var _a;
        if (((_a = this.headers["Prefer"]) !== null && _a !== void 0 ? _a : "").trim().length > 0) {
          this.headers["Prefer"] += ",tx=rollback";
        } else {
          this.headers["Prefer"] = "tx=rollback";
        }
        return this;
      }
      /**
       * Override the type of the returned `data`.
       *
       * @typeParam NewResult - The new result type to override with
       */
      returns() {
        return this;
      }
    };
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestFilterBuilder.js
var PostgrestFilterBuilder;
var init_PostgrestFilterBuilder = __esm({
  "node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestFilterBuilder.js"() {
    init_PostgrestTransformBuilder();
    PostgrestFilterBuilder = class extends PostgrestTransformBuilder {
      /**
       * Match only rows where `column` is equal to `value`.
       *
       * To check if the value of `column` is NULL, you should use `.is()` instead.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      eq(column, value) {
        this.url.searchParams.append(column, `eq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is not equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      neq(column, value) {
        this.url.searchParams.append(column, `neq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gt(column, value) {
        this.url.searchParams.append(column, `gt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gte(column, value) {
        this.url.searchParams.append(column, `gte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lt(column, value) {
        this.url.searchParams.append(column, `lt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lte(column, value) {
        this.url.searchParams.append(column, `lte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-sensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      like(column, pattern2) {
        this.url.searchParams.append(column, `like.${pattern2}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAllOf(column, patterns) {
        this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-insensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      ilike(column, pattern2) {
        this.url.searchParams.append(column, `ilike.${pattern2}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAllOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` IS `value`.
       *
       * For non-boolean columns, this is only relevant for checking if the value of
       * `column` is NULL by setting `value` to `null`.
       *
       * For boolean columns, you can also set `value` to `true` or `false` and it
       * will behave the same way as `.eq()`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      is(column, value) {
        this.url.searchParams.append(column, `is.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is included in the `values` array.
       *
       * @param column - The column to filter on
       * @param values - The values array to filter with
       */
      in(column, values) {
        const cleanedValues = values.map((s2) => {
          if (typeof s2 === "string" && new RegExp("[,()]").test(s2))
            return `"${s2}"`;
          else
            return `${s2}`;
        }).join(",");
        this.url.searchParams.append(column, `in.(${cleanedValues})`);
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * `column` contains every element appearing in `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      contains(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cs.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * every element appearing in `column` is contained by `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      containedBy(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cd.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is greater than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGt(column, range) {
        this.url.searchParams.append(column, `sr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or greater than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGte(column, range) {
        this.url.searchParams.append(column, `nxl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is less than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLt(column, range) {
        this.url.searchParams.append(column, `sl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or less than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLte(column, range) {
        this.url.searchParams.append(column, `nxr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where `column` is
       * mutually exclusive to `range` and there can be no element between the two
       * ranges.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeAdjacent(column, range) {
        this.url.searchParams.append(column, `adj.${range}`);
        return this;
      }
      /**
       * Only relevant for array and range columns. Match only rows where
       * `column` and `value` have an element in common.
       *
       * @param column - The array or range column to filter on
       * @param value - The array or range value to filter with
       */
      overlaps(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `ov.${value}`);
        } else {
          this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
        }
        return this;
      }
      /**
       * Only relevant for text and tsvector columns. Match only rows where
       * `column` matches the query string in `query`.
       *
       * @param column - The text or tsvector column to filter on
       * @param query - The query text to match with
       * @param options - Named parameters
       * @param options.config - The text search configuration to use
       * @param options.type - Change how the `query` text is interpreted
       */
      textSearch(column, query, { config, type } = {}) {
        let typePart = "";
        if (type === "plain") {
          typePart = "pl";
        } else if (type === "phrase") {
          typePart = "ph";
        } else if (type === "websearch") {
          typePart = "w";
        }
        const configPart = config === void 0 ? "" : `(${config})`;
        this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
        return this;
      }
      /**
       * Match only rows where each column in `query` keys is equal to its
       * associated value. Shorthand for multiple `.eq()`s.
       *
       * @param query - The object to filter with, with column names as keys mapped
       * to their filter values
       */
      match(query) {
        Object.entries(query).forEach(([column, value]) => {
          this.url.searchParams.append(column, `eq.${value}`);
        });
        return this;
      }
      /**
       * Match only rows which doesn't satisfy the filter.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to be negated to filter with, following
       * PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      not(column, operator, value) {
        this.url.searchParams.append(column, `not.${operator}.${value}`);
        return this;
      }
      /**
       * Match only rows which satisfy at least one of the filters.
       *
       * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure it's properly sanitized.
       *
       * It's currently not possible to do an `.or()` filter across multiple tables.
       *
       * @param filters - The filters to use, following PostgREST syntax
       * @param foreignTable - Set this to filter on foreign tables instead of the
       * current table
       */
      or(filters, { foreignTable } = {}) {
        const key2 = foreignTable ? `${foreignTable}.or` : "or";
        this.url.searchParams.append(key2, `(${filters})`);
        return this;
      }
      /**
       * Match only rows which satisfy the filter. This is an escape hatch - you
       * should use the specific filter methods wherever possible.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to filter with, following PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      filter(column, operator, value) {
        this.url.searchParams.append(column, `${operator}.${value}`);
        return this;
      }
    };
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestQueryBuilder.js
var PostgrestQueryBuilder;
var init_PostgrestQueryBuilder = __esm({
  "node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestQueryBuilder.js"() {
    init_PostgrestFilterBuilder();
    PostgrestQueryBuilder = class {
      constructor(url, { headers = {}, schema, fetch: fetch2 }) {
        this.url = url;
        this.headers = headers;
        this.schema = schema;
        this.fetch = fetch2;
      }
      /**
       * Perform a SELECT query on the table or view.
       *
       * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
       *
       * @param options - Named parameters
       *
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       *
       * @param options.count - Count algorithm to use to count rows in the table or view.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      select(columns, { head = false, count } = {}) {
        const method = head ? "HEAD" : "GET";
        let quoted2 = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted2) {
            return "";
          }
          if (c === '"') {
            quoted2 = !quoted2;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        if (count) {
          this.headers["Prefer"] = `count=${count}`;
        }
        return new PostgrestFilterBuilder({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform an INSERT into the table or view.
       *
       * By default, inserted rows are not returned. To return it, chain the call
       * with `.select()`.
       *
       * @param values - The values to insert. Pass an object to insert a single row
       * or an array to insert multiple rows.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count inserted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       *
       * @param options.defaultToNull - Make missing fields default to `null`.
       * Otherwise, use the default value for the column. Only applies for bulk
       * inserts.
       */
      insert(values, { count, defaultToNull = true } = {}) {
        const method = "POST";
        const prefersHeaders = [];
        if (this.headers["Prefer"]) {
          prefersHeaders.push(this.headers["Prefer"]);
        }
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        if (!defaultToNull) {
          prefersHeaders.push("missing=default");
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform an UPSERT on the table or view. Depending on the column(s) passed
       * to `onConflict`, `.upsert()` allows you to perform the equivalent of
       * `.insert()` if a row with the corresponding `onConflict` columns doesn't
       * exist, or if it does exist, perform an alternative action depending on
       * `ignoreDuplicates`.
       *
       * By default, upserted rows are not returned. To return it, chain the call
       * with `.select()`.
       *
       * @param values - The values to upsert with. Pass an object to upsert a
       * single row or an array to upsert multiple rows.
       *
       * @param options - Named parameters
       *
       * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
       * duplicate rows are determined. Two rows are duplicates if all the
       * `onConflict` columns are equal.
       *
       * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
       * `false`, duplicate rows are merged with existing rows.
       *
       * @param options.count - Count algorithm to use to count upserted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       *
       * @param options.defaultToNull - Make missing fields default to `null`.
       * Otherwise, use the default value for the column. This only applies when
       * inserting new rows, not when merging with existing rows under
       * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
       */
      upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
        const method = "POST";
        const prefersHeaders = [`resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`];
        if (onConflict !== void 0)
          this.url.searchParams.set("on_conflict", onConflict);
        if (this.headers["Prefer"]) {
          prefersHeaders.push(this.headers["Prefer"]);
        }
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        if (!defaultToNull) {
          prefersHeaders.push("missing=default");
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform an UPDATE on the table or view.
       *
       * By default, updated rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param values - The values to update with
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count updated rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      update(values, { count } = {}) {
        const method = "PATCH";
        const prefersHeaders = [];
        if (this.headers["Prefer"]) {
          prefersHeaders.push(this.headers["Prefer"]);
        }
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        return new PostgrestFilterBuilder({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform a DELETE on the table or view.
       *
       * By default, deleted rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count deleted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      delete({ count } = {}) {
        const method = "DELETE";
        const prefersHeaders = [];
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        if (this.headers["Prefer"]) {
          prefersHeaders.unshift(this.headers["Prefer"]);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        return new PostgrestFilterBuilder({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
    };
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/version.js
var version;
var init_version = __esm({
  "node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/version.js"() {
    version = "1.8.4";
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/constants.js
var DEFAULT_HEADERS;
var init_constants = __esm({
  "node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/constants.js"() {
    init_version();
    DEFAULT_HEADERS = { "X-Client-Info": `postgrest-js/${version}` };
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestClient.js
var PostgrestClient;
var init_PostgrestClient = __esm({
  "node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/PostgrestClient.js"() {
    init_PostgrestQueryBuilder();
    init_PostgrestFilterBuilder();
    init_constants();
    PostgrestClient = class _PostgrestClient {
      // TODO: Add back shouldThrowOnError once we figure out the typings
      /**
       * Creates a PostgREST client.
       *
       * @param url - URL of the PostgREST endpoint
       * @param options - Named parameters
       * @param options.headers - Custom headers
       * @param options.schema - Postgres schema to switch to
       * @param options.fetch - Custom fetch
       */
      constructor(url, { headers = {}, schema, fetch: fetch2 } = {}) {
        this.url = url;
        this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS), headers);
        this.schemaName = schema;
        this.fetch = fetch2;
      }
      /**
       * Perform a query on a table or a view.
       *
       * @param relation - The table or view name to query
       */
      from(relation) {
        const url = new URL(`${this.url}/${relation}`);
        return new PostgrestQueryBuilder(url, {
          headers: Object.assign({}, this.headers),
          schema: this.schemaName,
          fetch: this.fetch
        });
      }
      /**
       * Select a schema to query or perform an function (rpc) call.
       *
       * The schema needs to be on the list of exposed schemas inside Supabase.
       *
       * @param schema - The schema to query
       */
      schema(schema) {
        return new _PostgrestClient(this.url, {
          headers: this.headers,
          schema,
          fetch: this.fetch
        });
      }
      /**
       * Perform a function call.
       *
       * @param fn - The function name to call
       * @param args - The arguments to pass to the function call
       * @param options - Named parameters
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       * @param options.count - Count algorithm to use to count rows returned by the
       * function. Only applicable for [set-returning
       * functions](https://www.postgresql.org/docs/current/functions-srf.html).
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      rpc(fn, args = {}, { head = false, count } = {}) {
        let method;
        const url = new URL(`${this.url}/rpc/${fn}`);
        let body;
        if (head) {
          method = "HEAD";
          Object.entries(args).forEach(([name, value]) => {
            url.searchParams.append(name, `${value}`);
          });
        } else {
          method = "POST";
          body = args;
        }
        const headers = Object.assign({}, this.headers);
        if (count) {
          headers["Prefer"] = `count=${count}`;
        }
        return new PostgrestFilterBuilder({
          method,
          url,
          headers,
          schema: this.schemaName,
          body,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
    };
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/index.js
var init_module2 = __esm({
  "node_modules/.pnpm/@supabase+postgrest-js@1.8.4/node_modules/@supabase/postgrest-js/dist/module/index.js"() {
    init_PostgrestClient();
    init_PostgrestQueryBuilder();
    init_PostgrestFilterBuilder();
    init_PostgrestTransformBuilder();
    init_PostgrestBuilder();
  }
});

// node_modules/.pnpm/es5-ext@0.10.62/node_modules/es5-ext/global.js
var require_global = __commonJS({
  "node_modules/.pnpm/es5-ext@0.10.62/node_modules/es5-ext/global.js"(exports, module) {
    var naiveFallback = function() {
      if (typeof self === "object" && self)
        return self;
      if (typeof window === "object" && window)
        return window;
      throw new Error("Unable to resolve global `this`");
    };
    module.exports = function() {
      if (this)
        return this;
      if (typeof globalThis === "object" && globalThis)
        return globalThis;
      try {
        Object.defineProperty(Object.prototype, "__global__", {
          get: function() {
            return this;
          },
          configurable: true
        });
      } catch (error2) {
        return naiveFallback();
      }
      try {
        if (!__global__)
          return naiveFallback();
        return __global__;
      } finally {
        delete Object.prototype.__global__;
      }
    }();
  }
});

// node_modules/.pnpm/websocket@1.0.34/node_modules/websocket/package.json
var require_package = __commonJS({
  "node_modules/.pnpm/websocket@1.0.34/node_modules/websocket/package.json"(exports, module) {
    module.exports = {
      name: "websocket",
      description: "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
      keywords: [
        "websocket",
        "websockets",
        "socket",
        "networking",
        "comet",
        "push",
        "RFC-6455",
        "realtime",
        "server",
        "client"
      ],
      author: "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)",
      contributors: [
        "I\xF1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
      ],
      version: "1.0.34",
      repository: {
        type: "git",
        url: "https://github.com/theturtle32/WebSocket-Node.git"
      },
      homepage: "https://github.com/theturtle32/WebSocket-Node",
      engines: {
        node: ">=4.0.0"
      },
      dependencies: {
        bufferutil: "^4.0.1",
        debug: "^2.2.0",
        "es5-ext": "^0.10.50",
        "typedarray-to-buffer": "^3.1.5",
        "utf-8-validate": "^5.0.2",
        yaeti: "^0.0.6"
      },
      devDependencies: {
        "buffer-equal": "^1.0.0",
        gulp: "^4.0.2",
        "gulp-jshint": "^2.0.4",
        "jshint-stylish": "^2.2.1",
        jshint: "^2.0.0",
        tape: "^4.9.1"
      },
      config: {
        verbose: false
      },
      scripts: {
        test: "tape test/unit/*.js",
        gulp: "gulp"
      },
      main: "index",
      directories: {
        lib: "./lib"
      },
      browser: "lib/browser.js",
      license: "Apache-2.0"
    };
  }
});

// node_modules/.pnpm/websocket@1.0.34/node_modules/websocket/lib/version.js
var require_version = __commonJS({
  "node_modules/.pnpm/websocket@1.0.34/node_modules/websocket/lib/version.js"(exports, module) {
    module.exports = require_package().version;
  }
});

// node_modules/.pnpm/websocket@1.0.34/node_modules/websocket/lib/browser.js
var require_browser2 = __commonJS({
  "node_modules/.pnpm/websocket@1.0.34/node_modules/websocket/lib/browser.js"(exports, module) {
    var _globalThis;
    if (typeof globalThis === "object") {
      _globalThis = globalThis;
    } else {
      try {
        _globalThis = require_global();
      } catch (error2) {
      } finally {
        if (!_globalThis && typeof window !== "undefined") {
          _globalThis = window;
        }
        if (!_globalThis) {
          throw new Error("Could not determine global this");
        }
      }
    }
    var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;
    var websocket_version = require_version();
    function W3CWebSocket(uri, protocols) {
      var native_instance;
      if (protocols) {
        native_instance = new NativeWebSocket(uri, protocols);
      } else {
        native_instance = new NativeWebSocket(uri);
      }
      return native_instance;
    }
    if (NativeWebSocket) {
      ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(function(prop) {
        Object.defineProperty(W3CWebSocket, prop, {
          get: function() {
            return NativeWebSocket[prop];
          }
        });
      });
    }
    module.exports = {
      "w3cwebsocket": NativeWebSocket ? W3CWebSocket : null,
      "version": websocket_version
    };
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/version.js
var version2;
var init_version2 = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/version.js"() {
    version2 = "2.7.4";
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/constants.js
var DEFAULT_HEADERS2, VSN, DEFAULT_TIMEOUT, WS_CLOSE_NORMAL, SOCKET_STATES, CHANNEL_STATES, CHANNEL_EVENTS, TRANSPORTS, CONNECTION_STATE;
var init_constants2 = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/constants.js"() {
    init_version2();
    DEFAULT_HEADERS2 = { "X-Client-Info": `realtime-js/${version2}` };
    VSN = "1.0.0";
    DEFAULT_TIMEOUT = 1e4;
    WS_CLOSE_NORMAL = 1e3;
    (function(SOCKET_STATES2) {
      SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
      SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
      SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
      SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
    })(SOCKET_STATES || (SOCKET_STATES = {}));
    (function(CHANNEL_STATES2) {
      CHANNEL_STATES2["closed"] = "closed";
      CHANNEL_STATES2["errored"] = "errored";
      CHANNEL_STATES2["joined"] = "joined";
      CHANNEL_STATES2["joining"] = "joining";
      CHANNEL_STATES2["leaving"] = "leaving";
    })(CHANNEL_STATES || (CHANNEL_STATES = {}));
    (function(CHANNEL_EVENTS2) {
      CHANNEL_EVENTS2["close"] = "phx_close";
      CHANNEL_EVENTS2["error"] = "phx_error";
      CHANNEL_EVENTS2["join"] = "phx_join";
      CHANNEL_EVENTS2["reply"] = "phx_reply";
      CHANNEL_EVENTS2["leave"] = "phx_leave";
      CHANNEL_EVENTS2["access_token"] = "access_token";
    })(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
    (function(TRANSPORTS2) {
      TRANSPORTS2["websocket"] = "websocket";
    })(TRANSPORTS || (TRANSPORTS = {}));
    (function(CONNECTION_STATE2) {
      CONNECTION_STATE2["Connecting"] = "connecting";
      CONNECTION_STATE2["Open"] = "open";
      CONNECTION_STATE2["Closing"] = "closing";
      CONNECTION_STATE2["Closed"] = "closed";
    })(CONNECTION_STATE || (CONNECTION_STATE = {}));
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/timer.js
var Timer;
var init_timer = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/timer.js"() {
    Timer = class {
      constructor(callback, timerCalc) {
        this.callback = callback;
        this.timerCalc = timerCalc;
        this.timer = void 0;
        this.tries = 0;
        this.callback = callback;
        this.timerCalc = timerCalc;
      }
      reset() {
        this.tries = 0;
        clearTimeout(this.timer);
      }
      // Cancels any previous scheduleTimeout and schedules callback
      scheduleTimeout() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.tries = this.tries + 1;
          this.callback();
        }, this.timerCalc(this.tries + 1));
      }
    };
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/serializer.js
var Serializer;
var init_serializer = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/serializer.js"() {
    Serializer = class {
      constructor() {
        this.HEADER_LENGTH = 1;
      }
      decode(rawPayload, callback) {
        if (rawPayload.constructor === ArrayBuffer) {
          return callback(this._binaryDecode(rawPayload));
        }
        if (typeof rawPayload === "string") {
          return callback(JSON.parse(rawPayload));
        }
        return callback({});
      }
      _binaryDecode(buffer) {
        const view = new DataView(buffer);
        const decoder2 = new TextDecoder();
        return this._decodeBroadcast(buffer, view, decoder2);
      }
      _decodeBroadcast(buffer, view, decoder2) {
        const topicSize = view.getUint8(1);
        const eventSize = view.getUint8(2);
        let offset = this.HEADER_LENGTH + 2;
        const topic = decoder2.decode(buffer.slice(offset, offset + topicSize));
        offset = offset + topicSize;
        const event = decoder2.decode(buffer.slice(offset, offset + eventSize));
        offset = offset + eventSize;
        const data = JSON.parse(decoder2.decode(buffer.slice(offset, buffer.byteLength)));
        return { ref: null, topic, event, payload: data };
      }
    };
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/push.js
var Push;
var init_push = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/push.js"() {
    init_constants2();
    Push = class {
      /**
       * Initializes the Push
       *
       * @param channel The Channel
       * @param event The event, for example `"phx_join"`
       * @param payload The payload, for example `{user_id: 123}`
       * @param timeout The push timeout in milliseconds
       */
      constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
        this.channel = channel;
        this.event = event;
        this.payload = payload;
        this.timeout = timeout;
        this.sent = false;
        this.timeoutTimer = void 0;
        this.ref = "";
        this.receivedResp = null;
        this.recHooks = [];
        this.refEvent = null;
        this.rateLimited = false;
      }
      resend(timeout) {
        this.timeout = timeout;
        this._cancelRefEvent();
        this.ref = "";
        this.refEvent = null;
        this.receivedResp = null;
        this.sent = false;
        this.send();
      }
      send() {
        if (this._hasReceived("timeout")) {
          return;
        }
        this.startTimeout();
        this.sent = true;
        const status = this.channel.socket.push({
          topic: this.channel.topic,
          event: this.event,
          payload: this.payload,
          ref: this.ref,
          join_ref: this.channel._joinRef()
        });
        if (status === "rate limited") {
          this.rateLimited = true;
        }
      }
      updatePayload(payload) {
        this.payload = Object.assign(Object.assign({}, this.payload), payload);
      }
      receive(status, callback) {
        var _a;
        if (this._hasReceived(status)) {
          callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
        }
        this.recHooks.push({ status, callback });
        return this;
      }
      startTimeout() {
        if (this.timeoutTimer) {
          return;
        }
        this.ref = this.channel.socket._makeRef();
        this.refEvent = this.channel._replyEventName(this.ref);
        const callback = (payload) => {
          this._cancelRefEvent();
          this._cancelTimeout();
          this.receivedResp = payload;
          this._matchReceive(payload);
        };
        this.channel._on(this.refEvent, {}, callback);
        this.timeoutTimer = setTimeout(() => {
          this.trigger("timeout", {});
        }, this.timeout);
      }
      trigger(status, response) {
        if (this.refEvent)
          this.channel._trigger(this.refEvent, { status, response });
      }
      destroy() {
        this._cancelRefEvent();
        this._cancelTimeout();
      }
      _cancelRefEvent() {
        if (!this.refEvent) {
          return;
        }
        this.channel._off(this.refEvent, {});
      }
      _cancelTimeout() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = void 0;
      }
      _matchReceive({ status, response }) {
        this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
      }
      _hasReceived(status) {
        return this.receivedResp && this.receivedResp.status === status;
      }
    };
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js
var REALTIME_PRESENCE_LISTEN_EVENTS, RealtimePresence;
var init_RealtimePresence = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js"() {
    (function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
      REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
      REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
      REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
    })(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
    RealtimePresence = class _RealtimePresence {
      /**
       * Initializes the Presence.
       *
       * @param channel - The RealtimeChannel
       * @param opts - The options,
       *        for example `{events: {state: 'state', diff: 'diff'}}`
       */
      constructor(channel, opts) {
        this.channel = channel;
        this.state = {};
        this.pendingDiffs = [];
        this.joinRef = null;
        this.caller = {
          onJoin: () => {
          },
          onLeave: () => {
          },
          onSync: () => {
          }
        };
        const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
          state: "presence_state",
          diff: "presence_diff"
        };
        this.channel._on(events.state, {}, (newState) => {
          const { onJoin, onLeave, onSync } = this.caller;
          this.joinRef = this.channel._joinRef();
          this.state = _RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
          this.pendingDiffs.forEach((diff) => {
            this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
          });
          this.pendingDiffs = [];
          onSync();
        });
        this.channel._on(events.diff, {}, (diff) => {
          const { onJoin, onLeave, onSync } = this.caller;
          if (this.inPendingSyncState()) {
            this.pendingDiffs.push(diff);
          } else {
            this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
            onSync();
          }
        });
        this.onJoin((key2, currentPresences, newPresences) => {
          this.channel._trigger("presence", {
            event: "join",
            key: key2,
            currentPresences,
            newPresences
          });
        });
        this.onLeave((key2, currentPresences, leftPresences) => {
          this.channel._trigger("presence", {
            event: "leave",
            key: key2,
            currentPresences,
            leftPresences
          });
        });
        this.onSync(() => {
          this.channel._trigger("presence", { event: "sync" });
        });
      }
      /**
       * Used to sync the list of presences on the server with the
       * client's state.
       *
       * An optional `onJoin` and `onLeave` callback can be provided to
       * react to changes in the client's local presences across
       * disconnects and reconnects with the server.
       *
       * @internal
       */
      static syncState(currentState, newState, onJoin, onLeave) {
        const state = this.cloneDeep(currentState);
        const transformedState = this.transformState(newState);
        const joins = {};
        const leaves = {};
        this.map(state, (key2, presences) => {
          if (!transformedState[key2]) {
            leaves[key2] = presences;
          }
        });
        this.map(transformedState, (key2, newPresences) => {
          const currentPresences = state[key2];
          if (currentPresences) {
            const newPresenceRefs = newPresences.map((m) => m.presence_ref);
            const curPresenceRefs = currentPresences.map((m) => m.presence_ref);
            const joinedPresences = newPresences.filter((m) => curPresenceRefs.indexOf(m.presence_ref) < 0);
            const leftPresences = currentPresences.filter((m) => newPresenceRefs.indexOf(m.presence_ref) < 0);
            if (joinedPresences.length > 0) {
              joins[key2] = joinedPresences;
            }
            if (leftPresences.length > 0) {
              leaves[key2] = leftPresences;
            }
          } else {
            joins[key2] = newPresences;
          }
        });
        return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
      }
      /**
       * Used to sync a diff of presence join and leave events from the
       * server, as they happen.
       *
       * Like `syncState`, `syncDiff` accepts optional `onJoin` and
       * `onLeave` callbacks to react to a user joining or leaving from a
       * device.
       *
       * @internal
       */
      static syncDiff(state, diff, onJoin, onLeave) {
        const { joins, leaves } = {
          joins: this.transformState(diff.joins),
          leaves: this.transformState(diff.leaves)
        };
        if (!onJoin) {
          onJoin = () => {
          };
        }
        if (!onLeave) {
          onLeave = () => {
          };
        }
        this.map(joins, (key2, newPresences) => {
          var _a;
          const currentPresences = (_a = state[key2]) !== null && _a !== void 0 ? _a : [];
          state[key2] = this.cloneDeep(newPresences);
          if (currentPresences.length > 0) {
            const joinedPresenceRefs = state[key2].map((m) => m.presence_ref);
            const curPresences = currentPresences.filter((m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0);
            state[key2].unshift(...curPresences);
          }
          onJoin(key2, currentPresences, newPresences);
        });
        this.map(leaves, (key2, leftPresences) => {
          let currentPresences = state[key2];
          if (!currentPresences)
            return;
          const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref);
          currentPresences = currentPresences.filter((m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0);
          state[key2] = currentPresences;
          onLeave(key2, currentPresences, leftPresences);
          if (currentPresences.length === 0)
            delete state[key2];
        });
        return state;
      }
      /** @internal */
      static map(obj, func) {
        return Object.getOwnPropertyNames(obj).map((key2) => func(key2, obj[key2]));
      }
      /**
       * Remove 'metas' key
       * Change 'phx_ref' to 'presence_ref'
       * Remove 'phx_ref' and 'phx_ref_prev'
       *
       * @example
       * // returns {
       *  abc123: [
       *    { presence_ref: '2', user_id: 1 },
       *    { presence_ref: '3', user_id: 2 }
       *  ]
       * }
       * RealtimePresence.transformState({
       *  abc123: {
       *    metas: [
       *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
       *      { phx_ref: '3', user_id: 2 }
       *    ]
       *  }
       * })
       *
       * @internal
       */
      static transformState(state) {
        state = this.cloneDeep(state);
        return Object.getOwnPropertyNames(state).reduce((newState, key2) => {
          const presences = state[key2];
          if ("metas" in presences) {
            newState[key2] = presences.metas.map((presence) => {
              presence["presence_ref"] = presence["phx_ref"];
              delete presence["phx_ref"];
              delete presence["phx_ref_prev"];
              return presence;
            });
          } else {
            newState[key2] = presences;
          }
          return newState;
        }, {});
      }
      /** @internal */
      static cloneDeep(obj) {
        return JSON.parse(JSON.stringify(obj));
      }
      /** @internal */
      onJoin(callback) {
        this.caller.onJoin = callback;
      }
      /** @internal */
      onLeave(callback) {
        this.caller.onLeave = callback;
      }
      /** @internal */
      onSync(callback) {
        this.caller.onSync = callback;
      }
      /** @internal */
      inPendingSyncState() {
        return !this.joinRef || this.joinRef !== this.channel._joinRef();
      }
    };
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/transformers.js
var PostgresTypes, convertChangeData, convertColumn, convertCell, noop2, toBoolean, toNumber, toJson, toArray, toTimestampString;
var init_transformers = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/lib/transformers.js"() {
    (function(PostgresTypes2) {
      PostgresTypes2["abstime"] = "abstime";
      PostgresTypes2["bool"] = "bool";
      PostgresTypes2["date"] = "date";
      PostgresTypes2["daterange"] = "daterange";
      PostgresTypes2["float4"] = "float4";
      PostgresTypes2["float8"] = "float8";
      PostgresTypes2["int2"] = "int2";
      PostgresTypes2["int4"] = "int4";
      PostgresTypes2["int4range"] = "int4range";
      PostgresTypes2["int8"] = "int8";
      PostgresTypes2["int8range"] = "int8range";
      PostgresTypes2["json"] = "json";
      PostgresTypes2["jsonb"] = "jsonb";
      PostgresTypes2["money"] = "money";
      PostgresTypes2["numeric"] = "numeric";
      PostgresTypes2["oid"] = "oid";
      PostgresTypes2["reltime"] = "reltime";
      PostgresTypes2["text"] = "text";
      PostgresTypes2["time"] = "time";
      PostgresTypes2["timestamp"] = "timestamp";
      PostgresTypes2["timestamptz"] = "timestamptz";
      PostgresTypes2["timetz"] = "timetz";
      PostgresTypes2["tsrange"] = "tsrange";
      PostgresTypes2["tstzrange"] = "tstzrange";
    })(PostgresTypes || (PostgresTypes = {}));
    convertChangeData = (columns, record, options2 = {}) => {
      var _a;
      const skipTypes = (_a = options2.skipTypes) !== null && _a !== void 0 ? _a : [];
      return Object.keys(record).reduce((acc, rec_key) => {
        acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
        return acc;
      }, {});
    };
    convertColumn = (columnName, columns, record, skipTypes) => {
      const column = columns.find((x) => x.name === columnName);
      const colType = column === null || column === void 0 ? void 0 : column.type;
      const value = record[columnName];
      if (colType && !skipTypes.includes(colType)) {
        return convertCell(colType, value);
      }
      return noop2(value);
    };
    convertCell = (type, value) => {
      if (type.charAt(0) === "_") {
        const dataType = type.slice(1, type.length);
        return toArray(value, dataType);
      }
      switch (type) {
        case PostgresTypes.bool:
          return toBoolean(value);
        case PostgresTypes.float4:
        case PostgresTypes.float8:
        case PostgresTypes.int2:
        case PostgresTypes.int4:
        case PostgresTypes.int8:
        case PostgresTypes.numeric:
        case PostgresTypes.oid:
          return toNumber(value);
        case PostgresTypes.json:
        case PostgresTypes.jsonb:
          return toJson(value);
        case PostgresTypes.timestamp:
          return toTimestampString(value);
        case PostgresTypes.abstime:
        case PostgresTypes.date:
        case PostgresTypes.daterange:
        case PostgresTypes.int4range:
        case PostgresTypes.int8range:
        case PostgresTypes.money:
        case PostgresTypes.reltime:
        case PostgresTypes.text:
        case PostgresTypes.time:
        case PostgresTypes.timestamptz:
        case PostgresTypes.timetz:
        case PostgresTypes.tsrange:
        case PostgresTypes.tstzrange:
          return noop2(value);
        default:
          return noop2(value);
      }
    };
    noop2 = (value) => {
      return value;
    };
    toBoolean = (value) => {
      switch (value) {
        case "t":
          return true;
        case "f":
          return false;
        default:
          return value;
      }
    };
    toNumber = (value) => {
      if (typeof value === "string") {
        const parsedValue = parseFloat(value);
        if (!Number.isNaN(parsedValue)) {
          return parsedValue;
        }
      }
      return value;
    };
    toJson = (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (error2) {
          console.log(`JSON parse error: ${error2}`);
          return value;
        }
      }
      return value;
    };
    toArray = (value, type) => {
      if (typeof value !== "string") {
        return value;
      }
      const lastIdx = value.length - 1;
      const closeBrace = value[lastIdx];
      const openBrace = value[0];
      if (openBrace === "{" && closeBrace === "}") {
        let arr;
        const valTrim = value.slice(1, lastIdx);
        try {
          arr = JSON.parse("[" + valTrim + "]");
        } catch (_) {
          arr = valTrim ? valTrim.split(",") : [];
        }
        return arr.map((val) => convertCell(type, val));
      }
      return value;
    };
    toTimestampString = (value) => {
      if (typeof value === "string") {
        return value.replace(" ", "T");
      }
      return value;
    };
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js
var __awaiter2, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES, RealtimeChannel;
var init_RealtimeChannel = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js"() {
    init_constants2();
    init_push();
    init_timer();
    init_RealtimePresence();
    init_transformers();
    __awaiter2 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    (function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
    })(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
    (function(REALTIME_LISTEN_TYPES2) {
      REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
      REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
      REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
    })(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
    (function(REALTIME_SUBSCRIBE_STATES2) {
      REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
      REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
      REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
      REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
    })(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
    RealtimeChannel = class _RealtimeChannel {
      constructor(topic, params = { config: {} }, socket) {
        this.topic = topic;
        this.params = params;
        this.socket = socket;
        this.bindings = {};
        this.state = CHANNEL_STATES.closed;
        this.joinedOnce = false;
        this.pushBuffer = [];
        this.params.config = Object.assign({
          broadcast: { ack: false, self: false },
          presence: { key: "" }
        }, params.config);
        this.timeout = this.socket.timeout;
        this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
        this.rejoinTimer = new Timer(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
        this.joinPush.receive("ok", () => {
          this.state = CHANNEL_STATES.joined;
          this.rejoinTimer.reset();
          this.pushBuffer.forEach((pushEvent) => pushEvent.send());
          this.pushBuffer = [];
        });
        this._onClose(() => {
          this.rejoinTimer.reset();
          this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`);
          this.state = CHANNEL_STATES.closed;
          this.socket._remove(this);
        });
        this._onError((reason) => {
          if (this._isLeaving() || this._isClosed()) {
            return;
          }
          this.socket.log("channel", `error ${this.topic}`, reason);
          this.state = CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this.joinPush.receive("timeout", () => {
          if (!this._isJoining()) {
            return;
          }
          this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
          this.state = CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this._on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
          this._trigger(this._replyEventName(ref), payload);
        });
        this.presence = new RealtimePresence(this);
      }
      /** Subscribe registers your client with the server */
      subscribe(callback, timeout = this.timeout) {
        var _a, _b;
        if (this.joinedOnce) {
          throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
        } else {
          const { config: { broadcast, presence } } = this.params;
          this._onError((e) => callback && callback("CHANNEL_ERROR", e));
          this._onClose(() => callback && callback("CLOSED"));
          const accessTokenPayload = {};
          const config = {
            broadcast,
            presence,
            postgres_changes: (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : []
          };
          if (this.socket.accessToken) {
            accessTokenPayload.access_token = this.socket.accessToken;
          }
          this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
          this.joinedOnce = true;
          this._rejoin(timeout);
          this.joinPush.receive("ok", ({ postgres_changes: serverPostgresFilters }) => {
            var _a2;
            this.socket.accessToken && this.socket.setAuth(this.socket.accessToken);
            if (serverPostgresFilters === void 0) {
              callback && callback("SUBSCRIBED");
              return;
            } else {
              const clientPostgresBindings = this.bindings.postgres_changes;
              const bindingsLen = (_a2 = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a2 !== void 0 ? _a2 : 0;
              const newPostgresBindings = [];
              for (let i = 0; i < bindingsLen; i++) {
                const clientPostgresBinding = clientPostgresBindings[i];
                const { filter: { event, schema, table, filter } } = clientPostgresBinding;
                const serverPostgresFilter = serverPostgresFilters && serverPostgresFilters[i];
                if (serverPostgresFilter && serverPostgresFilter.event === event && serverPostgresFilter.schema === schema && serverPostgresFilter.table === table && serverPostgresFilter.filter === filter) {
                  newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
                } else {
                  this.unsubscribe();
                  callback && callback("CHANNEL_ERROR", new Error("mismatch between server and client bindings for postgres changes"));
                  return;
                }
              }
              this.bindings.postgres_changes = newPostgresBindings;
              callback && callback("SUBSCRIBED");
              return;
            }
          }).receive("error", (error2) => {
            callback && callback("CHANNEL_ERROR", new Error(JSON.stringify(Object.values(error2).join(", ") || "error")));
            return;
          }).receive("timeout", () => {
            callback && callback("TIMED_OUT");
            return;
          });
        }
        return this;
      }
      presenceState() {
        return this.presence.state;
      }
      track(payload, opts = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          return yield this.send({
            type: "presence",
            event: "track",
            payload
          }, opts.timeout || this.timeout);
        });
      }
      untrack(opts = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          return yield this.send({
            type: "presence",
            event: "untrack"
          }, opts);
        });
      }
      on(type, filter, callback) {
        return this._on(type, filter, callback);
      }
      send(payload, opts = {}) {
        return new Promise((resolve) => {
          var _a, _b, _c;
          const push = this._push(payload.type, payload, opts.timeout || this.timeout);
          if (push.rateLimited) {
            resolve("rate limited");
          }
          if (payload.type === "broadcast" && !((_c = (_b = (_a = this.params) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
            resolve("ok");
          }
          push.receive("ok", () => resolve("ok"));
          push.receive("timeout", () => resolve("timed out"));
        });
      }
      updateJoinPayload(payload) {
        this.joinPush.updatePayload(payload);
      }
      /**
       * Leaves the channel.
       *
       * Unsubscribes from server events, and instructs channel to terminate on server.
       * Triggers onClose() hooks.
       *
       * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
       * channel.unsubscribe().receive("ok", () => alert("left!") )
       */
      unsubscribe(timeout = this.timeout) {
        this.state = CHANNEL_STATES.leaving;
        const onClose = () => {
          this.socket.log("channel", `leave ${this.topic}`);
          this._trigger(CHANNEL_EVENTS.close, "leave", this._joinRef());
        };
        this.rejoinTimer.reset();
        this.joinPush.destroy();
        return new Promise((resolve) => {
          const leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
          leavePush.receive("ok", () => {
            onClose();
            resolve("ok");
          }).receive("timeout", () => {
            onClose();
            resolve("timed out");
          }).receive("error", () => {
            resolve("error");
          });
          leavePush.send();
          if (!this._canPush()) {
            leavePush.trigger("ok", {});
          }
        });
      }
      /** @internal */
      _push(event, payload, timeout = this.timeout) {
        if (!this.joinedOnce) {
          throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
        }
        let pushEvent = new Push(this, event, payload, timeout);
        if (this._canPush()) {
          pushEvent.send();
        } else {
          pushEvent.startTimeout();
          this.pushBuffer.push(pushEvent);
        }
        return pushEvent;
      }
      /**
       * Overridable message hook
       *
       * Receives all events for specialized message handling before dispatching to the channel callbacks.
       * Must return the payload, modified or unmodified.
       *
       * @internal
       */
      _onMessage(_event, payload, _ref) {
        return payload;
      }
      /** @internal */
      _isMember(topic) {
        return this.topic === topic;
      }
      /** @internal */
      _joinRef() {
        return this.joinPush.ref;
      }
      /** @internal */
      _trigger(type, payload, ref) {
        var _a, _b;
        const typeLower = type.toLocaleLowerCase();
        const { close, error: error2, leave, join } = CHANNEL_EVENTS;
        const events = [close, error2, leave, join];
        if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
          return;
        }
        let handledPayload = this._onMessage(typeLower, payload, ref);
        if (payload && !handledPayload) {
          throw "channel onMessage callbacks must return the payload, modified or unmodified";
        }
        if (["insert", "update", "delete"].includes(typeLower)) {
          (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter((bind) => {
            var _a2, _b2, _c;
            return ((_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event) === "*" || ((_c = (_b2 = bind.filter) === null || _b2 === void 0 ? void 0 : _b2.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower;
          }).map((bind) => bind.callback(handledPayload, ref));
        } else {
          (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter((bind) => {
            var _a2, _b2, _c, _d, _e, _f;
            if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
              if ("id" in bind) {
                const bindId = bind.id;
                const bindEvent = (_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event;
                return bindId && ((_b2 = payload.ids) === null || _b2 === void 0 ? void 0 : _b2.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase()));
              } else {
                const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
                return bindEvent === "*" || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase());
              }
            } else {
              return bind.type.toLocaleLowerCase() === typeLower;
            }
          }).map((bind) => {
            if (typeof handledPayload === "object" && "ids" in handledPayload) {
              const postgresChanges = handledPayload.data;
              const { schema, table, commit_timestamp, type: type2, errors } = postgresChanges;
              const enrichedPayload = {
                schema,
                table,
                commit_timestamp,
                eventType: type2,
                new: {},
                old: {},
                errors
              };
              handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
            }
            bind.callback(handledPayload, ref);
          });
        }
      }
      /** @internal */
      _isClosed() {
        return this.state === CHANNEL_STATES.closed;
      }
      /** @internal */
      _isJoined() {
        return this.state === CHANNEL_STATES.joined;
      }
      /** @internal */
      _isJoining() {
        return this.state === CHANNEL_STATES.joining;
      }
      /** @internal */
      _isLeaving() {
        return this.state === CHANNEL_STATES.leaving;
      }
      /** @internal */
      _replyEventName(ref) {
        return `chan_reply_${ref}`;
      }
      /** @internal */
      _on(type, filter, callback) {
        const typeLower = type.toLocaleLowerCase();
        const binding = {
          type: typeLower,
          filter,
          callback
        };
        if (this.bindings[typeLower]) {
          this.bindings[typeLower].push(binding);
        } else {
          this.bindings[typeLower] = [binding];
        }
        return this;
      }
      /** @internal */
      _off(type, filter) {
        const typeLower = type.toLocaleLowerCase();
        this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
          var _a;
          return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && _RealtimeChannel.isEqual(bind.filter, filter));
        });
        return this;
      }
      /** @internal */
      static isEqual(obj1, obj2) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
          return false;
        }
        for (const k in obj1) {
          if (obj1[k] !== obj2[k]) {
            return false;
          }
        }
        return true;
      }
      /** @internal */
      _rejoinUntilConnected() {
        this.rejoinTimer.scheduleTimeout();
        if (this.socket.isConnected()) {
          this._rejoin();
        }
      }
      /**
       * Registers a callback that will be executed when the channel closes.
       *
       * @internal
       */
      _onClose(callback) {
        this._on(CHANNEL_EVENTS.close, {}, callback);
      }
      /**
       * Registers a callback that will be executed when the channel encounteres an error.
       *
       * @internal
       */
      _onError(callback) {
        this._on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
      }
      /**
       * Returns `true` if the socket is connected and the channel has been joined.
       *
       * @internal
       */
      _canPush() {
        return this.socket.isConnected() && this._isJoined();
      }
      /** @internal */
      _rejoin(timeout = this.timeout) {
        if (this._isLeaving()) {
          return;
        }
        this.socket._leaveOpenTopic(this.topic);
        this.state = CHANNEL_STATES.joining;
        this.joinPush.resend(timeout);
      }
      /** @internal */
      _getPayloadRecords(payload) {
        const records = {
          new: {},
          old: {}
        };
        if (payload.type === "INSERT" || payload.type === "UPDATE") {
          records.new = convertChangeData(payload.columns, payload.record);
        }
        if (payload.type === "UPDATE" || payload.type === "DELETE") {
          records.old = convertChangeData(payload.columns, payload.old_record);
        }
        return records;
      }
    };
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js
var import_websocket, __awaiter3, noop3, RealtimeClient;
var init_RealtimeClient = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js"() {
    import_websocket = __toESM(require_browser2());
    init_constants2();
    init_timer();
    init_serializer();
    init_RealtimeChannel();
    __awaiter3 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    noop3 = () => {
    };
    RealtimeClient = class {
      /**
       * Initializes the Socket.
       *
       * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
       * @param options.transport The Websocket Transport, for example WebSocket.
       * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
       * @param options.params The optional params to pass when connecting.
       * @param options.headers The optional headers to pass when connecting.
       * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
       * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
       * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
       * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
       * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
       */
      constructor(endPoint, options2) {
        var _a, _b;
        this.accessToken = null;
        this.channels = [];
        this.endPoint = "";
        this.headers = DEFAULT_HEADERS2;
        this.params = {};
        this.timeout = DEFAULT_TIMEOUT;
        this.transport = import_websocket.w3cwebsocket;
        this.heartbeatIntervalMs = 3e4;
        this.heartbeatTimer = void 0;
        this.pendingHeartbeatRef = null;
        this.ref = 0;
        this.logger = noop3;
        this.conn = null;
        this.sendBuffer = [];
        this.serializer = new Serializer();
        this.stateChangeCallbacks = {
          open: [],
          close: [],
          error: [],
          message: []
        };
        this.eventsPerSecondLimitMs = 100;
        this.inThrottle = false;
        this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
        if (options2 === null || options2 === void 0 ? void 0 : options2.params)
          this.params = options2.params;
        if (options2 === null || options2 === void 0 ? void 0 : options2.headers)
          this.headers = Object.assign(Object.assign({}, this.headers), options2.headers);
        if (options2 === null || options2 === void 0 ? void 0 : options2.timeout)
          this.timeout = options2.timeout;
        if (options2 === null || options2 === void 0 ? void 0 : options2.logger)
          this.logger = options2.logger;
        if (options2 === null || options2 === void 0 ? void 0 : options2.transport)
          this.transport = options2.transport;
        if (options2 === null || options2 === void 0 ? void 0 : options2.heartbeatIntervalMs)
          this.heartbeatIntervalMs = options2.heartbeatIntervalMs;
        const eventsPerSecond = (_a = options2 === null || options2 === void 0 ? void 0 : options2.params) === null || _a === void 0 ? void 0 : _a.eventsPerSecond;
        if (eventsPerSecond)
          this.eventsPerSecondLimitMs = Math.floor(1e3 / eventsPerSecond);
        const accessToken = (_b = options2 === null || options2 === void 0 ? void 0 : options2.params) === null || _b === void 0 ? void 0 : _b.apikey;
        if (accessToken)
          this.accessToken = accessToken;
        this.reconnectAfterMs = (options2 === null || options2 === void 0 ? void 0 : options2.reconnectAfterMs) ? options2.reconnectAfterMs : (tries) => {
          return [1e3, 2e3, 5e3, 1e4][tries - 1] || 1e4;
        };
        this.encode = (options2 === null || options2 === void 0 ? void 0 : options2.encode) ? options2.encode : (payload, callback) => {
          return callback(JSON.stringify(payload));
        };
        this.decode = (options2 === null || options2 === void 0 ? void 0 : options2.decode) ? options2.decode : this.serializer.decode.bind(this.serializer);
        this.reconnectTimer = new Timer(() => __awaiter3(this, void 0, void 0, function* () {
          this.disconnect();
          this.connect();
        }), this.reconnectAfterMs);
      }
      /**
       * Connects the socket, unless already connected.
       */
      connect() {
        if (this.conn) {
          return;
        }
        this.conn = new this.transport(this._endPointURL(), [], null, this.headers);
        if (this.conn) {
          this.conn.binaryType = "arraybuffer";
          this.conn.onopen = () => this._onConnOpen();
          this.conn.onerror = (error2) => this._onConnError(error2);
          this.conn.onmessage = (event) => this._onConnMessage(event);
          this.conn.onclose = (event) => this._onConnClose(event);
        }
      }
      /**
       * Disconnects the socket.
       *
       * @param code A numeric status code to send on disconnect.
       * @param reason A custom reason for the disconnect.
       */
      disconnect(code, reason) {
        if (this.conn) {
          this.conn.onclose = function() {
          };
          if (code) {
            this.conn.close(code, reason !== null && reason !== void 0 ? reason : "");
          } else {
            this.conn.close();
          }
          this.conn = null;
          this.heartbeatTimer && clearInterval(this.heartbeatTimer);
          this.reconnectTimer.reset();
        }
      }
      /**
       * Returns all created channels
       */
      getChannels() {
        return this.channels;
      }
      /**
       * Unsubscribes and removes a single channel
       * @param channel A RealtimeChannel instance
       */
      removeChannel(channel) {
        return __awaiter3(this, void 0, void 0, function* () {
          const status = yield channel.unsubscribe();
          if (this.channels.length === 0) {
            this.disconnect();
          }
          return status;
        });
      }
      /**
       * Unsubscribes and removes all channels
       */
      removeAllChannels() {
        return __awaiter3(this, void 0, void 0, function* () {
          const values_1 = yield Promise.all(this.channels.map((channel) => channel.unsubscribe()));
          this.disconnect();
          return values_1;
        });
      }
      /**
       * Logs the message.
       *
       * For customized logging, `this.logger` can be overridden.
       */
      log(kind, msg, data) {
        this.logger(kind, msg, data);
      }
      /**
       * Returns the current state of the socket.
       */
      connectionState() {
        switch (this.conn && this.conn.readyState) {
          case SOCKET_STATES.connecting:
            return CONNECTION_STATE.Connecting;
          case SOCKET_STATES.open:
            return CONNECTION_STATE.Open;
          case SOCKET_STATES.closing:
            return CONNECTION_STATE.Closing;
          default:
            return CONNECTION_STATE.Closed;
        }
      }
      /**
       * Returns `true` is the connection is open.
       */
      isConnected() {
        return this.connectionState() === CONNECTION_STATE.Open;
      }
      channel(topic, params = { config: {} }) {
        if (!this.isConnected()) {
          this.connect();
        }
        const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
        this.channels.push(chan);
        return chan;
      }
      /**
       * Push out a message if the socket is connected.
       *
       * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
       */
      push(data) {
        const { topic, event, payload, ref } = data;
        let callback = () => {
          this.encode(data, (result) => {
            var _a;
            (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
          });
        };
        this.log("push", `${topic} ${event} (${ref})`, payload);
        if (this.isConnected()) {
          if (["broadcast", "presence", "postgres_changes"].includes(event)) {
            const isThrottled = this._throttle(callback)();
            if (isThrottled) {
              return "rate limited";
            }
          } else {
            callback();
          }
        } else {
          this.sendBuffer.push(callback);
        }
      }
      /**
       * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
       *
       * @param token A JWT string.
       */
      setAuth(token) {
        this.accessToken = token;
        this.channels.forEach((channel) => {
          token && channel.updateJoinPayload({ access_token: token });
          if (channel.joinedOnce && channel._isJoined()) {
            channel._push(CHANNEL_EVENTS.access_token, { access_token: token });
          }
        });
      }
      /**
       * Return the next message ref, accounting for overflows
       *
       * @internal
       */
      _makeRef() {
        let newRef = this.ref + 1;
        if (newRef === this.ref) {
          this.ref = 0;
        } else {
          this.ref = newRef;
        }
        return this.ref.toString();
      }
      /**
       * Unsubscribe from channels with the specified topic.
       *
       * @internal
       */
      _leaveOpenTopic(topic) {
        let dupChannel = this.channels.find((c) => c.topic === topic && (c._isJoined() || c._isJoining()));
        if (dupChannel) {
          this.log("transport", `leaving duplicate topic "${topic}"`);
          dupChannel.unsubscribe();
        }
      }
      /**
       * Removes a subscription from the socket.
       *
       * @param channel An open subscription.
       *
       * @internal
       */
      _remove(channel) {
        this.channels = this.channels.filter((c) => c._joinRef() !== channel._joinRef());
      }
      /**
       * Returns the URL of the websocket.
       *
       * @internal
       */
      _endPointURL() {
        return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }));
      }
      /** @internal */
      _onConnMessage(rawMessage) {
        this.decode(rawMessage.data, (msg) => {
          let { topic, event, payload, ref } = msg;
          if (ref && ref === this.pendingHeartbeatRef || event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
            this.pendingHeartbeatRef = null;
          }
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
          this.channels.filter((channel) => channel._isMember(topic)).forEach((channel) => channel._trigger(event, payload, ref));
          this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
        });
      }
      /** @internal */
      _onConnOpen() {
        this.log("transport", `connected to ${this._endPointURL()}`);
        this._flushSendBuffer();
        this.reconnectTimer.reset();
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs);
        this.stateChangeCallbacks.open.forEach((callback) => callback());
      }
      /** @internal */
      _onConnClose(event) {
        this.log("transport", "close", event);
        this._triggerChanError();
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        this.reconnectTimer.scheduleTimeout();
        this.stateChangeCallbacks.close.forEach((callback) => callback(event));
      }
      /** @internal */
      _onConnError(error2) {
        this.log("transport", error2.message);
        this._triggerChanError();
        this.stateChangeCallbacks.error.forEach((callback) => callback(error2));
      }
      /** @internal */
      _triggerChanError() {
        this.channels.forEach((channel) => channel._trigger(CHANNEL_EVENTS.error));
      }
      /** @internal */
      _appendParams(url, params) {
        if (Object.keys(params).length === 0) {
          return url;
        }
        const prefix2 = url.match(/\?/) ? "&" : "?";
        const query = new URLSearchParams(params);
        return `${url}${prefix2}${query}`;
      }
      /** @internal */
      _flushSendBuffer() {
        if (this.isConnected() && this.sendBuffer.length > 0) {
          this.sendBuffer.forEach((callback) => callback());
          this.sendBuffer = [];
        }
      }
      /** @internal */
      _sendHeartbeat() {
        var _a;
        if (!this.isConnected()) {
          return;
        }
        if (this.pendingHeartbeatRef) {
          this.pendingHeartbeatRef = null;
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
          (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, "hearbeat timeout");
          return;
        }
        this.pendingHeartbeatRef = this._makeRef();
        this.push({
          topic: "phoenix",
          event: "heartbeat",
          payload: {},
          ref: this.pendingHeartbeatRef
        });
        this.setAuth(this.accessToken);
      }
      /** @internal */
      _throttle(callback, eventsPerSecondLimitMs = this.eventsPerSecondLimitMs) {
        return () => {
          if (this.inThrottle)
            return true;
          callback();
          if (eventsPerSecondLimitMs > 0) {
            this.inThrottle = true;
            setTimeout(() => {
              this.inThrottle = false;
            }, eventsPerSecondLimitMs);
          }
          return false;
        };
      }
    };
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/index.js
var init_module3 = __esm({
  "node_modules/.pnpm/@supabase+realtime-js@2.7.4/node_modules/@supabase/realtime-js/dist/module/index.js"() {
    init_RealtimeClient();
    init_RealtimeChannel();
    init_RealtimePresence();
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/errors.js
function isStorageError(error2) {
  return typeof error2 === "object" && error2 !== null && "__isStorageError" in error2;
}
var StorageError, StorageApiError, StorageUnknownError;
var init_errors2 = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/errors.js"() {
    StorageError = class extends Error {
      constructor(message) {
        super(message);
        this.__isStorageError = true;
        this.name = "StorageError";
      }
    };
    StorageApiError = class extends StorageError {
      constructor(message, status) {
        super(message);
        this.name = "StorageApiError";
        this.status = status;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status
        };
      }
    };
    StorageUnknownError = class extends StorageError {
      constructor(message, originalError) {
        super(message);
        this.name = "StorageUnknownError";
        this.originalError = originalError;
      }
    };
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/helpers.js
var __awaiter4, resolveFetch2, resolveResponse;
var init_helpers = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/helpers.js"() {
    __awaiter4 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    resolveFetch2 = (customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = (...args) => Promise.resolve().then(() => __toESM(require_browser())).then(({ default: fetch2 }) => fetch2(...args));
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    };
    resolveResponse = () => __awaiter4(void 0, void 0, void 0, function* () {
      if (typeof Response === "undefined") {
        return (yield Promise.resolve().then(() => __toESM(require_browser()))).Response;
      }
      return Response;
    });
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/fetch.js
function _handleRequest(fetcher, method, url, options2, parameters, body) {
  return __awaiter5(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options2, parameters, body)).then((result) => {
        if (!result.ok)
          throw result;
        if (options2 === null || options2 === void 0 ? void 0 : options2.noResolveJson)
          return result;
        return result.json();
      }).then((data) => resolve(data)).catch((error2) => handleError(error2, reject));
    });
  });
}
function get(fetcher, url, options2, parameters) {
  return __awaiter5(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "GET", url, options2, parameters);
  });
}
function post(fetcher, url, body, options2, parameters) {
  return __awaiter5(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "POST", url, options2, parameters, body);
  });
}
function put(fetcher, url, body, options2, parameters) {
  return __awaiter5(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "PUT", url, options2, parameters, body);
  });
}
function remove(fetcher, url, body, options2, parameters) {
  return __awaiter5(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "DELETE", url, options2, parameters, body);
  });
}
var __awaiter5, _getErrorMessage, handleError, _getRequestParams;
var init_fetch = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/fetch.js"() {
    init_errors2();
    init_helpers();
    __awaiter5 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    handleError = (error2, reject) => __awaiter5(void 0, void 0, void 0, function* () {
      const Res = yield resolveResponse();
      if (error2 instanceof Res) {
        error2.json().then((err) => {
          reject(new StorageApiError(_getErrorMessage(err), error2.status || 500));
        }).catch((err) => {
          reject(new StorageUnknownError(_getErrorMessage(err), err));
        });
      } else {
        reject(new StorageUnknownError(_getErrorMessage(error2), error2));
      }
    });
    _getRequestParams = (method, options2, parameters, body) => {
      const params = { method, headers: (options2 === null || options2 === void 0 ? void 0 : options2.headers) || {} };
      if (method === "GET") {
        return params;
      }
      params.headers = Object.assign({ "Content-Type": "application/json" }, options2 === null || options2 === void 0 ? void 0 : options2.headers);
      params.body = JSON.stringify(body);
      return Object.assign(Object.assign({}, params), parameters);
    };
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js
var __awaiter6, DEFAULT_SEARCH_OPTIONS, DEFAULT_FILE_OPTIONS, StorageFileApi;
var init_StorageFileApi = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js"() {
    init_errors2();
    init_fetch();
    init_helpers();
    __awaiter6 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    DEFAULT_SEARCH_OPTIONS = {
      limit: 100,
      offset: 0,
      sortBy: {
        column: "name",
        order: "asc"
      }
    };
    DEFAULT_FILE_OPTIONS = {
      cacheControl: "3600",
      contentType: "text/plain;charset=UTF-8",
      upsert: false
    };
    StorageFileApi = class {
      constructor(url, headers = {}, bucketId, fetch2) {
        this.url = url;
        this.headers = headers;
        this.bucketId = bucketId;
        this.fetch = resolveFetch2(fetch2);
      }
      /**
       * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
       *
       * @param method HTTP method.
       * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
       * @param fileBody The body of the file to be stored in the bucket.
       */
      uploadOrUpdate(method, path, fileBody, fileOptions) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            let body;
            const options2 = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
            const headers = Object.assign(Object.assign({}, this.headers), method === "POST" && { "x-upsert": String(options2.upsert) });
            if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
              body = new FormData();
              body.append("cacheControl", options2.cacheControl);
              body.append("", fileBody);
            } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
              body = fileBody;
              body.append("cacheControl", options2.cacheControl);
            } else {
              body = fileBody;
              headers["cache-control"] = `max-age=${options2.cacheControl}`;
              headers["content-type"] = options2.contentType;
            }
            const cleanPath = this._removeEmptyFolders(path);
            const _path = this._getFinalPath(cleanPath);
            const res = yield this.fetch(`${this.url}/object/${_path}`, Object.assign({ method, body, headers }, (options2 === null || options2 === void 0 ? void 0 : options2.duplex) ? { duplex: options2.duplex } : {}));
            if (res.ok) {
              return {
                data: { path: cleanPath },
                error: null
              };
            } else {
              const error2 = yield res.json();
              return { data: null, error: error2 };
            }
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Uploads a file to an existing bucket.
       *
       * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
       * @param fileBody The body of the file to be stored in the bucket.
       */
      upload(path, fileBody, fileOptions) {
        return __awaiter6(this, void 0, void 0, function* () {
          return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
        });
      }
      /**
       * Upload a file with a token generated from `createSignedUploadUrl`.
       * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
       * @param token The token generated from `createSignedUploadUrl`
       * @param fileBody The body of the file to be stored in the bucket.
       */
      uploadToSignedUrl(path, token, fileBody, fileOptions) {
        return __awaiter6(this, void 0, void 0, function* () {
          const cleanPath = this._removeEmptyFolders(path);
          const _path = this._getFinalPath(cleanPath);
          const url = new URL(this.url + `/object/upload/sign/${_path}`);
          url.searchParams.set("token", token);
          try {
            let body;
            const options2 = Object.assign({ upsert: DEFAULT_FILE_OPTIONS.upsert }, fileOptions);
            const headers = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(options2.upsert) });
            if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
              body = new FormData();
              body.append("cacheControl", options2.cacheControl);
              body.append("", fileBody);
            } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
              body = fileBody;
              body.append("cacheControl", options2.cacheControl);
            } else {
              body = fileBody;
              headers["cache-control"] = `max-age=${options2.cacheControl}`;
              headers["content-type"] = options2.contentType;
            }
            const res = yield this.fetch(url.toString(), {
              method: "PUT",
              body,
              headers
            });
            if (res.ok) {
              return {
                data: { path: cleanPath },
                error: null
              };
            } else {
              const error2 = yield res.json();
              return { data: null, error: error2 };
            }
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Creates a signed upload URL.
       * Signed upload URLs can be used to upload files to the bucket without further authentication.
       * They are valid for 2 hours.
       * @param path The file path, including the current file name. For example `folder/image.png`.
       */
      createSignedUploadUrl(path) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            let _path = this._getFinalPath(path);
            const data = yield post(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, { headers: this.headers });
            const url = new URL(this.url + data.url);
            const token = url.searchParams.get("token");
            if (!token) {
              throw new StorageError("No token returned by API");
            }
            return { data: { signedUrl: url.toString(), path, token }, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Replaces an existing file at the specified path with a new one.
       *
       * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
       * @param fileBody The body of the file to be stored in the bucket.
       */
      update(path, fileBody, fileOptions) {
        return __awaiter6(this, void 0, void 0, function* () {
          return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
        });
      }
      /**
       * Moves an existing file to a new path in the same bucket.
       *
       * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
       * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
       */
      move(fromPath, toPath) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Copies an existing file to a new path in the same bucket.
       *
       * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
       * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
       */
      copy(fromPath, toPath) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
            return { data: { path: data.Key }, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
       *
       * @param path The file path, including the current file name. For example `folder/image.png`.
       * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
       * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
       * @param options.transform Transform the asset before serving it to the client.
       */
      createSignedUrl(path, expiresIn, options2) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            let _path = this._getFinalPath(path);
            let data = yield post(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({ expiresIn }, (options2 === null || options2 === void 0 ? void 0 : options2.transform) ? { transform: options2.transform } : {}), { headers: this.headers });
            const downloadQueryParam = (options2 === null || options2 === void 0 ? void 0 : options2.download) ? `&download=${options2.download === true ? "" : options2.download}` : "";
            const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
            data = { signedUrl };
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
       *
       * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
       * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
       * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
       */
      createSignedUrls(paths, expiresIn, options2) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
            const downloadQueryParam = (options2 === null || options2 === void 0 ? void 0 : options2.download) ? `&download=${options2.download === true ? "" : options2.download}` : "";
            return {
              data: data.map((datum) => Object.assign(Object.assign({}, datum), { signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null })),
              error: null
            };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
       *
       * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
       * @param options.transform Transform the asset before serving it to the client.
       */
      download(path, options2) {
        return __awaiter6(this, void 0, void 0, function* () {
          const wantsTransformation = typeof (options2 === null || options2 === void 0 ? void 0 : options2.transform) !== "undefined";
          const renderPath = wantsTransformation ? "render/image/authenticated" : "object";
          const transformationQuery = this.transformOptsToQueryString((options2 === null || options2 === void 0 ? void 0 : options2.transform) || {});
          const queryString = transformationQuery ? `?${transformationQuery}` : "";
          try {
            const _path = this._getFinalPath(path);
            const res = yield get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
              headers: this.headers,
              noResolveJson: true
            });
            const data = yield res.blob();
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
       * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
       *
       * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
       * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
       * @param options.transform Transform the asset before serving it to the client.
       */
      getPublicUrl(path, options2) {
        const _path = this._getFinalPath(path);
        const _queryString = [];
        const downloadQueryParam = (options2 === null || options2 === void 0 ? void 0 : options2.download) ? `download=${options2.download === true ? "" : options2.download}` : "";
        if (downloadQueryParam !== "") {
          _queryString.push(downloadQueryParam);
        }
        const wantsTransformation = typeof (options2 === null || options2 === void 0 ? void 0 : options2.transform) !== "undefined";
        const renderPath = wantsTransformation ? "render/image" : "object";
        const transformationQuery = this.transformOptsToQueryString((options2 === null || options2 === void 0 ? void 0 : options2.transform) || {});
        if (transformationQuery !== "") {
          _queryString.push(transformationQuery);
        }
        let queryString = _queryString.join("&");
        if (queryString !== "") {
          queryString = `?${queryString}`;
        }
        return {
          data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) }
        };
      }
      /**
       * Deletes files within the same bucket
       *
       * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
       */
      remove(paths) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const data = yield remove(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Get file metadata
       * @param id the file id to retrieve metadata
       */
      // async getMetadata(
      //   id: string
      // ): Promise<
      //   | {
      //       data: Metadata
      //       error: null
      //     }
      //   | {
      //       data: null
      //       error: StorageError
      //     }
      // > {
      //   try {
      //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
      //     return { data, error: null }
      //   } catch (error) {
      //     if (isStorageError(error)) {
      //       return { data: null, error }
      //     }
      //     throw error
      //   }
      // }
      /**
       * Update file metadata
       * @param id the file id to update metadata
       * @param meta the new file metadata
       */
      // async updateMetadata(
      //   id: string,
      //   meta: Metadata
      // ): Promise<
      //   | {
      //       data: Metadata
      //       error: null
      //     }
      //   | {
      //       data: null
      //       error: StorageError
      //     }
      // > {
      //   try {
      //     const data = await post(
      //       this.fetch,
      //       `${this.url}/metadata/${id}`,
      //       { ...meta },
      //       { headers: this.headers }
      //     )
      //     return { data, error: null }
      //   } catch (error) {
      //     if (isStorageError(error)) {
      //       return { data: null, error }
      //     }
      //     throw error
      //   }
      // }
      /**
       * Lists all the files within a bucket.
       * @param path The folder path.
       */
      list(path, options2, parameters) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options2), { prefix: path || "" });
            const data = yield post(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      _getFinalPath(path) {
        return `${this.bucketId}/${path}`;
      }
      _removeEmptyFolders(path) {
        return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
      }
      transformOptsToQueryString(transform) {
        const params = [];
        if (transform.width) {
          params.push(`width=${transform.width}`);
        }
        if (transform.height) {
          params.push(`height=${transform.height}`);
        }
        if (transform.resize) {
          params.push(`resize=${transform.resize}`);
        }
        if (transform.format) {
          params.push(`format=${transform.format}`);
        }
        if (transform.quality) {
          params.push(`quality=${transform.quality}`);
        }
        return params.join("&");
      }
    };
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/version.js
var version3;
var init_version3 = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/version.js"() {
    version3 = "2.5.4";
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/constants.js
var DEFAULT_HEADERS3;
var init_constants3 = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/constants.js"() {
    init_version3();
    DEFAULT_HEADERS3 = { "X-Client-Info": `storage-js/${version3}` };
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js
var __awaiter7, StorageBucketApi;
var init_StorageBucketApi = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js"() {
    init_constants3();
    init_errors2();
    init_fetch();
    init_helpers();
    __awaiter7 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    StorageBucketApi = class {
      constructor(url, headers = {}, fetch2) {
        this.url = url;
        this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS3), headers);
        this.fetch = resolveFetch2(fetch2);
      }
      /**
       * Retrieves the details of all Storage buckets within an existing project.
       */
      listBuckets() {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield get(this.fetch, `${this.url}/bucket`, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Retrieves the details of an existing Storage bucket.
       *
       * @param id The unique identifier of the bucket you would like to retrieve.
       */
      getBucket(id) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Creates a new Storage bucket
       *
       * @param id A unique identifier for the bucket you are creating.
       * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
       * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
       * The global file size limit takes precedence over this value.
       * The default value is null, which doesn't set a per bucket file size limit.
       * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
       * The default value is null, which allows files with all mime types to be uploaded.
       * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
       * @returns newly created bucket id
       */
      createBucket(id, options2 = {
        public: false
      }) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/bucket`, {
              id,
              name: id,
              public: options2.public,
              file_size_limit: options2.fileSizeLimit,
              allowed_mime_types: options2.allowedMimeTypes
            }, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Updates a Storage bucket
       *
       * @param id A unique identifier for the bucket you are updating.
       * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
       * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
       * The global file size limit takes precedence over this value.
       * The default value is null, which doesn't set a per bucket file size limit.
       * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
       * The default value is null, which allows files with all mime types to be uploaded.
       * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
       */
      updateBucket(id, options2) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield put(this.fetch, `${this.url}/bucket/${id}`, {
              id,
              name: id,
              public: options2.public,
              file_size_limit: options2.fileSizeLimit,
              allowed_mime_types: options2.allowedMimeTypes
            }, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Removes all objects inside a single bucket.
       *
       * @param id The unique identifier of the bucket you would like to empty.
       */
      emptyBucket(id) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
      /**
       * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
       * You must first `empty()` the bucket.
       *
       * @param id The unique identifier of the bucket you would like to delete.
       */
      deleteBucket(id) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield remove(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            if (isStorageError(error2)) {
              return { data: null, error: error2 };
            }
            throw error2;
          }
        });
      }
    };
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/StorageClient.js
var StorageClient;
var init_StorageClient = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/StorageClient.js"() {
    init_StorageFileApi();
    init_StorageBucketApi();
    StorageClient = class extends StorageBucketApi {
      constructor(url, headers = {}, fetch2) {
        super(url, headers, fetch2);
      }
      /**
       * Perform file operation in a bucket.
       *
       * @param id The bucket id to operate on.
       */
      from(id) {
        return new StorageFileApi(this.url, this.headers, id, this.fetch);
      }
    };
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/types.js
var init_types2 = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/lib/types.js"() {
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/index.js
var init_module4 = __esm({
  "node_modules/.pnpm/@supabase+storage-js@2.5.4/node_modules/@supabase/storage-js/dist/module/index.js"() {
    init_StorageClient();
    init_types2();
    init_errors2();
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/version.js
var version4;
var init_version4 = __esm({
  "node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/version.js"() {
    version4 = "2.33.2";
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/constants.js
var DEFAULT_HEADERS4;
var init_constants4 = __esm({
  "node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/constants.js"() {
    init_version4();
    DEFAULT_HEADERS4 = { "X-Client-Info": `supabase-js/${version4}` };
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/fetch.js
var import_node_fetch2, __awaiter8, resolveFetch3, resolveHeadersConstructor, fetchWithAuth;
var init_fetch2 = __esm({
  "node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/fetch.js"() {
    import_node_fetch2 = __toESM(require_browser());
    __awaiter8 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    resolveFetch3 = (customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = import_node_fetch2.default;
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    };
    resolveHeadersConstructor = () => {
      if (typeof Headers === "undefined") {
        return import_node_fetch2.Headers;
      }
      return Headers;
    };
    fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
      const fetch2 = resolveFetch3(customFetch);
      const HeadersConstructor = resolveHeadersConstructor();
      return (input, init2) => __awaiter8(void 0, void 0, void 0, function* () {
        var _a;
        const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
        let headers = new HeadersConstructor(init2 === null || init2 === void 0 ? void 0 : init2.headers);
        if (!headers.has("apikey")) {
          headers.set("apikey", supabaseKey);
        }
        if (!headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return fetch2(input, Object.assign(Object.assign({}, init2), { headers }));
      });
    };
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/helpers.js
function stripTrailingSlash(url) {
  return url.replace(/\/$/, "");
}
function applySettingDefaults(options2, defaults) {
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options2;
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults;
  return {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    global: Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions)
  };
}
var init_helpers2 = __esm({
  "node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/helpers.js"() {
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/helpers.js
function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1e3);
  return timeNow + expiresIn;
}
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function parseParametersFromURL(href) {
  const result = {};
  const url = new URL(href);
  if (url.hash && url.hash[0] === "#") {
    try {
      const hashSearchParams = new URLSearchParams(url.hash.substring(1));
      hashSearchParams.forEach((value, key2) => {
        result[key2] = value;
      });
    } catch (e) {
    }
  }
  url.searchParams.forEach((value, key2) => {
    result[key2] = value;
  });
  return result;
}
function decodeBase64URL(value) {
  const key2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let base642 = "";
  let chr1, chr2, chr3;
  let enc1, enc2, enc3, enc4;
  let i = 0;
  value = value.replace("-", "+").replace("_", "/");
  while (i < value.length) {
    enc1 = key2.indexOf(value.charAt(i++));
    enc2 = key2.indexOf(value.charAt(i++));
    enc3 = key2.indexOf(value.charAt(i++));
    enc4 = key2.indexOf(value.charAt(i++));
    chr1 = enc1 << 2 | enc2 >> 4;
    chr2 = (enc2 & 15) << 4 | enc3 >> 2;
    chr3 = (enc3 & 3) << 6 | enc4;
    base642 = base642 + String.fromCharCode(chr1);
    if (enc3 != 64 && chr2 != 0) {
      base642 = base642 + String.fromCharCode(chr2);
    }
    if (enc4 != 64 && chr3 != 0) {
      base642 = base642 + String.fromCharCode(chr3);
    }
  }
  return base642;
}
function decodeJWTPayload(token) {
  const base64UrlRegex = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i;
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT is not valid: not a JWT structure");
  }
  if (!base64UrlRegex.test(parts[1])) {
    throw new Error("JWT is not valid: payload is not in base64url format");
  }
  const base64Url = parts[1];
  return JSON.parse(decodeBase64URL(base64Url));
}
async function sleep(time) {
  return await new Promise((accept) => {
    setTimeout(() => accept(null), time);
  });
}
function retryable(fn, isRetryable) {
  const promise = new Promise((accept, reject) => {
    ;
    (async () => {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = await fn(attempt);
          if (!isRetryable(attempt, null, result)) {
            accept(result);
            return;
          }
        } catch (e) {
          if (!isRetryable(attempt, e)) {
            reject(e);
            return;
          }
        }
      }
    })();
  });
  return promise;
}
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
function generatePKCEVerifier() {
  const verifierLength = 56;
  const array2 = new Uint32Array(verifierLength);
  if (typeof crypto === "undefined") {
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const charSetLen = charSet.length;
    let verifier = "";
    for (let i = 0; i < verifierLength; i++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
    }
    return verifier;
  }
  crypto.getRandomValues(array2);
  return Array.from(array2, dec2hex).join("");
}
async function sha256(randomString) {
  const encoder4 = new TextEncoder();
  const encodedData = encoder4.encode(randomString);
  const hash2 = await crypto.subtle.digest("SHA-256", encodedData);
  const bytes = new Uint8Array(hash2);
  return Array.from(bytes).map((c) => String.fromCharCode(c)).join("");
}
function base64urlencode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function generatePKCEChallenge(verifier) {
  if (typeof crypto === "undefined") {
    console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
    return verifier;
  }
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}
var isBrowser, localStorageWriteTests, supportsLocalStorage, resolveFetch4, looksLikeFetchResponse, setItemAsync, getItemAsync, removeItemAsync, Deferred;
var init_helpers3 = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/helpers.js"() {
    isBrowser = () => typeof document !== "undefined";
    localStorageWriteTests = {
      tested: false,
      writable: false
    };
    supportsLocalStorage = () => {
      if (!isBrowser()) {
        return false;
      }
      try {
        if (typeof globalThis.localStorage !== "object") {
          return false;
        }
      } catch (e) {
        return false;
      }
      if (localStorageWriteTests.tested) {
        return localStorageWriteTests.writable;
      }
      const randomKey = `lswt-${Math.random()}${Math.random()}`;
      try {
        globalThis.localStorage.setItem(randomKey, randomKey);
        globalThis.localStorage.removeItem(randomKey);
        localStorageWriteTests.tested = true;
        localStorageWriteTests.writable = true;
      } catch (e) {
        localStorageWriteTests.tested = true;
        localStorageWriteTests.writable = false;
      }
      return localStorageWriteTests.writable;
    };
    resolveFetch4 = (customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = (...args) => Promise.resolve().then(() => __toESM(require_browser())).then(({ default: fetch2 }) => fetch2(...args));
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    };
    looksLikeFetchResponse = (maybeResponse) => {
      return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
    };
    setItemAsync = async (storage2, key2, data) => {
      await storage2.setItem(key2, JSON.stringify(data));
    };
    getItemAsync = async (storage2, key2) => {
      const value = await storage2.getItem(key2);
      if (!value) {
        return null;
      }
      try {
        return JSON.parse(value);
      } catch (_a) {
        return value;
      }
    };
    removeItemAsync = async (storage2, key2) => {
      await storage2.removeItem(key2);
    };
    Deferred = class _Deferred {
      constructor() {
        ;
        this.promise = new _Deferred.promiseConstructor((res, rej) => {
          ;
          this.resolve = res;
          this.reject = rej;
        });
      }
    };
    Deferred.promiseConstructor = Promise;
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/errors.js
function isAuthError(error2) {
  return typeof error2 === "object" && error2 !== null && "__isAuthError" in error2;
}
function isAuthApiError(error2) {
  return isAuthError(error2) && error2.name === "AuthApiError";
}
function isAuthRetryableFetchError(error2) {
  return isAuthError(error2) && error2.name === "AuthRetryableFetchError";
}
var AuthError, AuthApiError, AuthUnknownError, CustomAuthError, AuthSessionMissingError, AuthInvalidTokenResponseError, AuthInvalidCredentialsError, AuthImplicitGrantRedirectError, AuthPKCEGrantCodeExchangeError, AuthRetryableFetchError;
var init_errors3 = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/errors.js"() {
    AuthError = class extends Error {
      constructor(message, status) {
        super(message);
        this.__isAuthError = true;
        this.name = "AuthError";
        this.status = status;
      }
    };
    AuthApiError = class extends AuthError {
      constructor(message, status) {
        super(message, status);
        this.name = "AuthApiError";
        this.status = status;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status
        };
      }
    };
    AuthUnknownError = class extends AuthError {
      constructor(message, originalError) {
        super(message);
        this.name = "AuthUnknownError";
        this.originalError = originalError;
      }
    };
    CustomAuthError = class extends AuthError {
      constructor(message, name, status) {
        super(message);
        this.name = name;
        this.status = status;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status
        };
      }
    };
    AuthSessionMissingError = class extends CustomAuthError {
      constructor() {
        super("Auth session missing!", "AuthSessionMissingError", 400);
      }
    };
    AuthInvalidTokenResponseError = class extends CustomAuthError {
      constructor() {
        super("Auth session or user missing", "AuthInvalidTokenResponseError", 500);
      }
    };
    AuthInvalidCredentialsError = class extends CustomAuthError {
      constructor(message) {
        super(message, "AuthInvalidCredentialsError", 400);
      }
    };
    AuthImplicitGrantRedirectError = class extends CustomAuthError {
      constructor(message, details = null) {
        super(message, "AuthImplicitGrantRedirectError", 500);
        this.details = null;
        this.details = details;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status,
          details: this.details
        };
      }
    };
    AuthPKCEGrantCodeExchangeError = class extends CustomAuthError {
      constructor(message, details = null) {
        super(message, "AuthPKCEGrantCodeExchangeError", 500);
        this.details = null;
        this.details = details;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status,
          details: this.details
        };
      }
    };
    AuthRetryableFetchError = class extends CustomAuthError {
      constructor(message, status) {
        super(message, "AuthRetryableFetchError", status);
      }
    };
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/fetch.js
async function handleError2(error2) {
  if (!looksLikeFetchResponse(error2)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(error2), 0);
  }
  if (NETWORK_ERROR_CODES.includes(error2.status)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(error2), error2.status);
  }
  let data;
  try {
    data = await error2.json();
  } catch (e) {
    throw new AuthUnknownError(_getErrorMessage2(e), e);
  }
  throw new AuthApiError(_getErrorMessage2(data), error2.status || 500);
}
async function _request(fetcher, method, url, options2) {
  var _a;
  const headers = Object.assign({}, options2 === null || options2 === void 0 ? void 0 : options2.headers);
  if (options2 === null || options2 === void 0 ? void 0 : options2.jwt) {
    headers["Authorization"] = `Bearer ${options2.jwt}`;
  }
  const qs = (_a = options2 === null || options2 === void 0 ? void 0 : options2.query) !== null && _a !== void 0 ? _a : {};
  if (options2 === null || options2 === void 0 ? void 0 : options2.redirectTo) {
    qs["redirect_to"] = options2.redirectTo;
  }
  const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
  const data = await _handleRequest2(fetcher, method, url + queryString, { headers, noResolveJson: options2 === null || options2 === void 0 ? void 0 : options2.noResolveJson }, {}, options2 === null || options2 === void 0 ? void 0 : options2.body);
  return (options2 === null || options2 === void 0 ? void 0 : options2.xform) ? options2 === null || options2 === void 0 ? void 0 : options2.xform(data) : { data: Object.assign({}, data), error: null };
}
async function _handleRequest2(fetcher, method, url, options2, parameters, body) {
  const requestParams = _getRequestParams2(method, options2, parameters, body);
  let result;
  try {
    result = await fetcher(url, requestParams);
  } catch (e) {
    console.error(e);
    throw new AuthRetryableFetchError(_getErrorMessage2(e), 0);
  }
  if (!result.ok) {
    await handleError2(result);
  }
  if (options2 === null || options2 === void 0 ? void 0 : options2.noResolveJson) {
    return result;
  }
  try {
    return await result.json();
  } catch (e) {
    await handleError2(e);
  }
}
function _sessionResponse(data) {
  var _a;
  let session2 = null;
  if (hasSession(data)) {
    session2 = Object.assign({}, data);
    if (!data.expires_at) {
      session2.expires_at = expiresAt(data.expires_in);
    }
  }
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { session: session2, user }, error: null };
}
function _userResponse(data) {
  var _a;
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { user }, error: null };
}
function _ssoResponse(data) {
  return { data, error: null };
}
function _generateLinkResponse(data) {
  const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
  const properties = {
    action_link,
    email_otp,
    hashed_token,
    redirect_to,
    verification_type
  };
  const user = Object.assign({}, rest);
  return {
    data: {
      properties,
      user
    },
    error: null
  };
}
function _noResolveJsonResponse(data) {
  return data;
}
function hasSession(data) {
  return data.access_token && data.refresh_token && data.expires_in;
}
var __rest, _getErrorMessage2, NETWORK_ERROR_CODES, _getRequestParams2;
var init_fetch3 = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/fetch.js"() {
    init_helpers3();
    init_errors3();
    __rest = function(s2, e) {
      var t = {};
      for (var p in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p) && e.indexOf(p) < 0)
          t[p] = s2[p];
      if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s2); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i]))
            t[p[i]] = s2[p[i]];
        }
      return t;
    };
    _getErrorMessage2 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    NETWORK_ERROR_CODES = [502, 503, 504];
    _getRequestParams2 = (method, options2, parameters, body) => {
      const params = { method, headers: (options2 === null || options2 === void 0 ? void 0 : options2.headers) || {} };
      if (method === "GET") {
        return params;
      }
      params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options2 === null || options2 === void 0 ? void 0 : options2.headers);
      params.body = JSON.stringify(body);
      return Object.assign(Object.assign({}, params), parameters);
    };
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/GoTrueAdminApi.js
var __rest2, GoTrueAdminApi;
var init_GoTrueAdminApi = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/GoTrueAdminApi.js"() {
    init_fetch3();
    init_helpers3();
    init_errors3();
    __rest2 = function(s2, e) {
      var t = {};
      for (var p in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p) && e.indexOf(p) < 0)
          t[p] = s2[p];
      if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s2); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i]))
            t[p[i]] = s2[p[i]];
        }
      return t;
    };
    GoTrueAdminApi = class {
      constructor({ url = "", headers = {}, fetch: fetch2 }) {
        this.url = url;
        this.headers = headers;
        this.fetch = resolveFetch4(fetch2);
        this.mfa = {
          listFactors: this._listFactors.bind(this),
          deleteFactor: this._deleteFactor.bind(this)
        };
      }
      /**
       * Removes a logged-in session.
       * @param jwt A valid, logged-in JWT.
       * @param scope The logout sope.
       */
      async signOut(jwt, scope = "global") {
        try {
          await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
            headers: this.headers,
            jwt,
            noResolveJson: true
          });
          return { data: null, error: null };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: null, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Sends an invite link to an email address.
       * @param email The email address of the user.
       * @param options Additional options to be included when inviting.
       */
      async inviteUserByEmail(email, options2 = {}) {
        try {
          return await _request(this.fetch, "POST", `${this.url}/invite`, {
            body: { email, data: options2.data },
            headers: this.headers,
            redirectTo: options2.redirectTo,
            xform: _userResponse
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Generates email links and OTPs to be sent via a custom email provider.
       * @param email The user's email.
       * @param options.password User password. For signup only.
       * @param options.data Optional user metadata. For signup only.
       * @param options.redirectTo The redirect url which should be appended to the generated link
       */
      async generateLink(params) {
        try {
          const { options: options2 } = params, rest = __rest2(params, ["options"]);
          const body = Object.assign(Object.assign({}, rest), options2);
          if ("newEmail" in rest) {
            body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
            delete body["newEmail"];
          }
          return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
            body,
            headers: this.headers,
            xform: _generateLinkResponse,
            redirectTo: options2 === null || options2 === void 0 ? void 0 : options2.redirectTo
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return {
              data: {
                properties: null,
                user: null
              },
              error: error2
            };
          }
          throw error2;
        }
      }
      // User Admin API
      /**
       * Creates a new user.
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async createUser(attributes) {
        try {
          return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
            body: attributes,
            headers: this.headers,
            xform: _userResponse
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Get a list of users.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
       */
      async listUsers(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
          const pagination = { nextPage: null, lastPage: 0, total: 0 };
          const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
            headers: this.headers,
            noResolveJson: true,
            query: {
              page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
              per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
            },
            xform: _noResolveJsonResponse
          });
          if (response.error)
            throw response.error;
          const users = await response.json();
          const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
          const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
          if (links.length > 0) {
            links.forEach((link) => {
              const page2 = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
              const rel = JSON.parse(link.split(";")[1].split("=")[1]);
              pagination[`${rel}Page`] = page2;
            });
            pagination.total = parseInt(total);
          }
          return { data: Object.assign(Object.assign({}, users), pagination), error: null };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { users: [] }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Get user by id.
       *
       * @param uid The user's unique identifier
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async getUserById(uid) {
        try {
          return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
            headers: this.headers,
            xform: _userResponse
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Updates the user data.
       *
       * @param attributes The data you want to update.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async updateUserById(uid, attributes) {
        try {
          return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
            body: attributes,
            headers: this.headers,
            xform: _userResponse
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Delete a user. Requires a `service_role` key.
       *
       * @param id The user id you want to remove.
       * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema.
       * Defaults to false for backward compatibility.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async deleteUser(id, shouldSoftDelete = false) {
        try {
          return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
            headers: this.headers,
            body: {
              should_soft_delete: shouldSoftDelete
            },
            xform: _userResponse
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null }, error: error2 };
          }
          throw error2;
        }
      }
      async _listFactors(params) {
        try {
          const { data, error: error2 } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
            headers: this.headers,
            xform: (factors) => {
              return { data: { factors }, error: null };
            }
          });
          return { data, error: error2 };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: null, error: error2 };
          }
          throw error2;
        }
      }
      async _deleteFactor(params) {
        try {
          const data = await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
            headers: this.headers
          });
          return { data, error: null };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: null, error: error2 };
          }
          throw error2;
        }
      }
    };
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/version.js
var version5;
var init_version5 = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/version.js"() {
    version5 = "2.52.0";
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/constants.js
var GOTRUE_URL, STORAGE_KEY, DEFAULT_HEADERS5, EXPIRY_MARGIN;
var init_constants5 = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/constants.js"() {
    init_version5();
    GOTRUE_URL = "http://localhost:9999";
    STORAGE_KEY = "supabase.auth.token";
    DEFAULT_HEADERS5 = { "X-Client-Info": `gotrue-js/${version5}` };
    EXPIRY_MARGIN = 10;
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/local-storage.js
var localStorageAdapter, local_storage_default;
var init_local_storage = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/local-storage.js"() {
    init_helpers3();
    localStorageAdapter = {
      getItem: (key2) => {
        if (!supportsLocalStorage()) {
          return null;
        }
        return globalThis.localStorage.getItem(key2);
      },
      setItem: (key2, value) => {
        if (!supportsLocalStorage()) {
          return;
        }
        globalThis.localStorage.setItem(key2, value);
      },
      removeItem: (key2) => {
        if (!supportsLocalStorage()) {
          return;
        }
        globalThis.localStorage.removeItem(key2);
      }
    };
    local_storage_default = localStorageAdapter;
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/polyfills.js
function polyfillGlobalThis() {
  if (typeof globalThis === "object")
    return;
  try {
    Object.defineProperty(Object.prototype, "__magic__", {
      get: function() {
        return this;
      },
      configurable: true
    });
    __magic__.globalThis = __magic__;
    delete Object.prototype.__magic__;
  } catch (e) {
    if (typeof self !== "undefined") {
      self.globalThis = self;
    }
  }
}
var init_polyfills = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/polyfills.js"() {
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/locks.js
var internals, LockAcquireTimeoutError;
var init_locks = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/locks.js"() {
    init_helpers3();
    internals = {
      /**
       * @experimental
       */
      debug: !!(globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
    };
    LockAcquireTimeoutError = class extends Error {
      constructor(message) {
        super(message);
        this.isAcquireTimeout = true;
      }
    };
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/GoTrueClient.js
async function lockNoOp(name, acquireTimeout, fn) {
  return await fn();
}
var DEFAULT_OPTIONS, AUTO_REFRESH_TICK_DURATION, AUTO_REFRESH_TICK_THRESHOLD, GoTrueClient;
var init_GoTrueClient = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/GoTrueClient.js"() {
    init_GoTrueAdminApi();
    init_constants5();
    init_errors3();
    init_fetch3();
    init_helpers3();
    init_local_storage();
    init_polyfills();
    init_version5();
    init_locks();
    polyfillGlobalThis();
    DEFAULT_OPTIONS = {
      url: GOTRUE_URL,
      storageKey: STORAGE_KEY,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      headers: DEFAULT_HEADERS5,
      flowType: "implicit",
      debug: false
    };
    AUTO_REFRESH_TICK_DURATION = 30 * 1e3;
    AUTO_REFRESH_TICK_THRESHOLD = 3;
    GoTrueClient = class _GoTrueClient {
      /**
       * Create a new client for use in the browser.
       */
      constructor(options2) {
        var _a;
        this.stateChangeEmitters = /* @__PURE__ */ new Map();
        this.autoRefreshTicker = null;
        this.visibilityChangedCallback = null;
        this.refreshingDeferred = null;
        this.initializePromise = null;
        this.detectSessionInUrl = true;
        this.lockAcquired = false;
        this.pendingInLock = [];
        this.broadcastChannel = null;
        this.logger = console.log;
        this.instanceID = _GoTrueClient.nextInstanceID;
        _GoTrueClient.nextInstanceID += 1;
        if (this.instanceID > 0 && isBrowser()) {
          console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
        }
        const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options2);
        this.logDebugMessages = !!settings.debug;
        if (typeof settings.debug === "function") {
          this.logger = settings.debug;
        }
        this.inMemorySession = null;
        this.storageKey = settings.storageKey;
        this.autoRefreshToken = settings.autoRefreshToken;
        this.persistSession = settings.persistSession;
        this.storage = settings.storage || local_storage_default;
        this.admin = new GoTrueAdminApi({
          url: settings.url,
          headers: settings.headers,
          fetch: settings.fetch
        });
        this.url = settings.url;
        this.headers = settings.headers;
        this.fetch = resolveFetch4(settings.fetch);
        this.lock = settings.lock || lockNoOp;
        this.detectSessionInUrl = settings.detectSessionInUrl;
        this.flowType = settings.flowType;
        this.mfa = {
          verify: this._verify.bind(this),
          enroll: this._enroll.bind(this),
          unenroll: this._unenroll.bind(this),
          challenge: this._challenge.bind(this),
          listFactors: this._listFactors.bind(this),
          challengeAndVerify: this._challengeAndVerify.bind(this),
          getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
        };
        if (this.persistSession && this.storage === local_storage_default && !supportsLocalStorage()) {
          console.warn(`No storage option exists to persist the session, which may result in unexpected behavior when using auth.
        If you want to set persistSession to true, please provide a storage option or you may set persistSession to false to disable this warning.`);
        }
        if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
          try {
            this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
          } catch (e) {
            console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e);
          }
          (_a = this.broadcastChannel) === null || _a === void 0 ? void 0 : _a.addEventListener("message", async (event) => {
            this._debug("received broadcast notification from other tab or client", event);
            await this._notifyAllSubscribers(event.data.event, event.data.session, false);
          });
        }
        this.initialize();
      }
      _debug(...args) {
        if (this.logDebugMessages) {
          this.logger(`GoTrueClient@${this.instanceID} (${version5}) ${(/* @__PURE__ */ new Date()).toISOString()}`, ...args);
        }
        return this;
      }
      /**
       * Initializes the client session either from the url or from storage.
       * This method is automatically called when instantiating the client, but should also be called
       * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
       */
      async initialize() {
        if (this.initializePromise) {
          return await this.initializePromise;
        }
        this.initializePromise = (async () => {
          return await this._acquireLock(-1, async () => {
            return await this._initialize();
          });
        })();
        return await this.initializePromise;
      }
      /**
       * IMPORTANT:
       * 1. Never throw in this method, as it is called from the constructor
       * 2. Never return a session from this method as it would be cached over
       *    the whole lifetime of the client
       */
      async _initialize() {
        try {
          const isPKCEFlow = isBrowser() ? await this._isPKCEFlow() : false;
          this._debug("#_initialize()", "begin", "is PKCE flow", isPKCEFlow);
          if (isPKCEFlow || this.detectSessionInUrl && this._isImplicitGrantFlow()) {
            const { data, error: error2 } = await this._getSessionFromURL(isPKCEFlow);
            if (error2) {
              this._debug("#_initialize()", "error detecting session from URL", error2);
              await this._removeSession();
              return { error: error2 };
            }
            const { session: session2, redirectType } = data;
            this._debug("#_initialize()", "detected session in URL", session2, "redirect type", redirectType);
            await this._saveSession(session2);
            setTimeout(async () => {
              if (redirectType === "recovery") {
                await this._notifyAllSubscribers("PASSWORD_RECOVERY", session2);
              } else {
                await this._notifyAllSubscribers("SIGNED_IN", session2);
              }
            }, 0);
            return { error: null };
          }
          await this._recoverAndRefresh();
          return { error: null };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { error: error2 };
          }
          return {
            error: new AuthUnknownError("Unexpected error during initialization", error2)
          };
        } finally {
          await this._handleVisibilityChange();
          this._debug("#_initialize()", "end");
        }
      }
      /**
       * Creates a new user.
       *
       * Be aware that if a user account exists in the system you may get back an
       * error message that attempts to hide this information from the user.
       * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
       *
       * @returns A logged-in session if the server has "autoconfirm" ON
       * @returns A user if the server has "autoconfirm" OFF
       */
      async signUp(credentials) {
        var _a, _b, _c;
        try {
          await this._removeSession();
          let res;
          if ("email" in credentials) {
            const { email, password, options: options2 } = credentials;
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === "pkce") {
              const codeVerifier = generatePKCEVerifier();
              await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
              codeChallenge = await generatePKCEChallenge(codeVerifier);
              codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
            }
            res = await _request(this.fetch, "POST", `${this.url}/signup`, {
              headers: this.headers,
              redirectTo: options2 === null || options2 === void 0 ? void 0 : options2.emailRedirectTo,
              body: {
                email,
                password,
                data: (_a = options2 === null || options2 === void 0 ? void 0 : options2.data) !== null && _a !== void 0 ? _a : {},
                gotrue_meta_security: { captcha_token: options2 === null || options2 === void 0 ? void 0 : options2.captchaToken },
                code_challenge: codeChallenge,
                code_challenge_method: codeChallengeMethod
              },
              xform: _sessionResponse
            });
          } else if ("phone" in credentials) {
            const { phone, password, options: options2 } = credentials;
            res = await _request(this.fetch, "POST", `${this.url}/signup`, {
              headers: this.headers,
              body: {
                phone,
                password,
                data: (_b = options2 === null || options2 === void 0 ? void 0 : options2.data) !== null && _b !== void 0 ? _b : {},
                channel: (_c = options2 === null || options2 === void 0 ? void 0 : options2.channel) !== null && _c !== void 0 ? _c : "sms",
                gotrue_meta_security: { captcha_token: options2 === null || options2 === void 0 ? void 0 : options2.captchaToken }
              },
              xform: _sessionResponse
            });
          } else {
            throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
          }
          const { data, error: error2 } = res;
          if (error2 || !data) {
            return { data: { user: null, session: null }, error: error2 };
          }
          const session2 = data.session;
          const user = data.user;
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", session2);
          }
          return { data: { user, session: session2 }, error: null };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null, session: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Log in an existing user with an email and password or phone and password.
       *
       * Be aware that you may get back an error message that will not distinguish
       * between the cases where the account does not exist or that the
       * email/phone and password combination is wrong or that the account can only
       * be accessed via social login.
       */
      async signInWithPassword(credentials) {
        try {
          await this._removeSession();
          let res;
          if ("email" in credentials) {
            const { email, password, options: options2 } = credentials;
            res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
              headers: this.headers,
              body: {
                email,
                password,
                gotrue_meta_security: { captcha_token: options2 === null || options2 === void 0 ? void 0 : options2.captchaToken }
              },
              xform: _sessionResponse
            });
          } else if ("phone" in credentials) {
            const { phone, password, options: options2 } = credentials;
            res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
              headers: this.headers,
              body: {
                phone,
                password,
                gotrue_meta_security: { captcha_token: options2 === null || options2 === void 0 ? void 0 : options2.captchaToken }
              },
              xform: _sessionResponse
            });
          } else {
            throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
          }
          const { data, error: error2 } = res;
          if (error2) {
            return { data: { user: null, session: null }, error: error2 };
          } else if (!data || !data.session || !data.user) {
            return { data: { user: null, session: null }, error: new AuthInvalidTokenResponseError() };
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return { data: { user: data.user, session: data.session }, error: error2 };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null, session: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Log in an existing user via a third-party provider.
       * This method supports the PKCE flow.
       */
      async signInWithOAuth(credentials) {
        var _a, _b, _c, _d;
        await this._removeSession();
        return await this._handleProviderSignIn(credentials.provider, {
          redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
          scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
          queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
          skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
        });
      }
      /**
       * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
       */
      async exchangeCodeForSession(authCode) {
        await this.initializePromise;
        return this._acquireLock(-1, async () => {
          return this._exchangeCodeForSession(authCode);
        });
      }
      async _exchangeCodeForSession(authCode) {
        const codeVerifier = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        const { data, error: error2 } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
          headers: this.headers,
          body: {
            auth_code: authCode,
            code_verifier: codeVerifier
          },
          xform: _sessionResponse
        });
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (error2) {
          return { data: { user: null, session: null }, error: error2 };
        } else if (!data || !data.session || !data.user) {
          return { data: { user: null, session: null }, error: new AuthInvalidTokenResponseError() };
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return { data, error: error2 };
      }
      /**
       * Allows signing in with an OIDC ID token. The authentication provider used
       * should be enabled and configured.
       */
      async signInWithIdToken(credentials) {
        await this._removeSession();
        try {
          const { options: options2, provider, token, access_token, nonce } = credentials;
          const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
            headers: this.headers,
            body: {
              provider,
              id_token: token,
              access_token,
              nonce,
              gotrue_meta_security: { captcha_token: options2 === null || options2 === void 0 ? void 0 : options2.captchaToken }
            },
            xform: _sessionResponse
          });
          const { data, error: error2 } = res;
          if (error2) {
            return { data: { user: null, session: null }, error: error2 };
          } else if (!data || !data.session || !data.user) {
            return {
              data: { user: null, session: null },
              error: new AuthInvalidTokenResponseError()
            };
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return { data, error: error2 };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null, session: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Log in a user using magiclink or a one-time password (OTP).
       *
       * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
       * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
       * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
       *
       * Be aware that you may get back an error message that will not distinguish
       * between the cases where the account does not exist or, that the account
       * can only be accessed via social login.
       *
       * Do note that you will need to configure a Whatsapp sender on Twilio
       * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
       * channel is not supported on other providers
       * at this time.
       * This method supports PKCE when an email is passed.
       */
      async signInWithOtp(credentials) {
        var _a, _b, _c, _d, _e;
        try {
          await this._removeSession();
          if ("email" in credentials) {
            const { email, options: options2 } = credentials;
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === "pkce") {
              const codeVerifier = generatePKCEVerifier();
              await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
              codeChallenge = await generatePKCEChallenge(codeVerifier);
              codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
            }
            const { error: error2 } = await _request(this.fetch, "POST", `${this.url}/otp`, {
              headers: this.headers,
              body: {
                email,
                data: (_a = options2 === null || options2 === void 0 ? void 0 : options2.data) !== null && _a !== void 0 ? _a : {},
                create_user: (_b = options2 === null || options2 === void 0 ? void 0 : options2.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
                gotrue_meta_security: { captcha_token: options2 === null || options2 === void 0 ? void 0 : options2.captchaToken },
                code_challenge: codeChallenge,
                code_challenge_method: codeChallengeMethod
              },
              redirectTo: options2 === null || options2 === void 0 ? void 0 : options2.emailRedirectTo
            });
            return { data: { user: null, session: null }, error: error2 };
          }
          if ("phone" in credentials) {
            const { phone, options: options2 } = credentials;
            const { data, error: error2 } = await _request(this.fetch, "POST", `${this.url}/otp`, {
              headers: this.headers,
              body: {
                phone,
                data: (_c = options2 === null || options2 === void 0 ? void 0 : options2.data) !== null && _c !== void 0 ? _c : {},
                create_user: (_d = options2 === null || options2 === void 0 ? void 0 : options2.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
                gotrue_meta_security: { captcha_token: options2 === null || options2 === void 0 ? void 0 : options2.captchaToken },
                channel: (_e = options2 === null || options2 === void 0 ? void 0 : options2.channel) !== null && _e !== void 0 ? _e : "sms"
              }
            });
            return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error: error2 };
          }
          throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null, session: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
       */
      async verifyOtp(params) {
        var _a, _b;
        try {
          if (params.type !== "email_change" && params.type !== "phone_change") {
            await this._removeSession();
          }
          let redirectTo = void 0;
          let captchaToken = void 0;
          if ("options" in params) {
            redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
            captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
          }
          const { data, error: error2 } = await _request(this.fetch, "POST", `${this.url}/verify`, {
            headers: this.headers,
            body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
            redirectTo,
            xform: _sessionResponse
          });
          if (error2) {
            throw error2;
          }
          if (!data) {
            throw new Error("An error occurred on token verification.");
          }
          const session2 = data.session;
          const user = data.user;
          if (session2 === null || session2 === void 0 ? void 0 : session2.access_token) {
            await this._saveSession(session2);
            await this._notifyAllSubscribers("SIGNED_IN", session2);
          }
          return { data: { user, session: session2 }, error: null };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null, session: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Attempts a single-sign on using an enterprise Identity Provider. A
       * successful SSO attempt will redirect the current page to the identity
       * provider authorization page. The redirect URL is implementation and SSO
       * protocol specific.
       *
       * You can use it by providing a SSO domain. Typically you can extract this
       * domain by asking users for their email address. If this domain is
       * registered on the Auth instance the redirect will use that organization's
       * currently active SSO Identity Provider for the login.
       *
       * If you have built an organization-specific login page, you can use the
       * organization's SSO Identity Provider UUID directly instead.
       */
      async signInWithSSO(params) {
        var _a, _b, _c;
        try {
          await this._removeSession();
          return await _request(this.fetch, "POST", `${this.url}/sso`, {
            body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true }),
            headers: this.headers,
            xform: _ssoResponse
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: null, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Sends a reauthentication OTP to the user's email or phone number.
       * Requires the user to be signed-in.
       */
      async reauthenticate() {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._reauthenticate();
        });
      }
      async _reauthenticate() {
        try {
          return await this._useSession(async (result) => {
            const { data: { session: session2 }, error: sessionError } = result;
            if (sessionError)
              throw sessionError;
            if (!session2)
              throw new AuthSessionMissingError();
            const { error: error2 } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
              headers: this.headers,
              jwt: session2.access_token
            });
            return { data: { user: null, session: null }, error: error2 };
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null, session: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
       */
      async resend(credentials) {
        try {
          if (credentials.type != "email_change" && credentials.type != "phone_change") {
            await this._removeSession();
          }
          const endpoint = `${this.url}/resend`;
          if ("email" in credentials) {
            const { email, type, options: options2 } = credentials;
            const { error: error2 } = await _request(this.fetch, "POST", endpoint, {
              headers: this.headers,
              body: {
                email,
                type,
                gotrue_meta_security: { captcha_token: options2 === null || options2 === void 0 ? void 0 : options2.captchaToken }
              },
              redirectTo: options2 === null || options2 === void 0 ? void 0 : options2.emailRedirectTo
            });
            return { data: { user: null, session: null }, error: error2 };
          } else if ("phone" in credentials) {
            const { phone, type, options: options2 } = credentials;
            const { data, error: error2 } = await _request(this.fetch, "POST", endpoint, {
              headers: this.headers,
              body: {
                phone,
                type,
                gotrue_meta_security: { captcha_token: options2 === null || options2 === void 0 ? void 0 : options2.captchaToken }
              }
            });
            return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error: error2 };
          }
          throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null, session: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Returns the session, refreshing it if necessary.
       * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
       */
      async getSession() {
        await this.initializePromise;
        return this._acquireLock(-1, async () => {
          return this._useSession(async (result) => {
            return result;
          });
        });
      }
      /**
       * Acquires a global lock based on the storage key.
       */
      async _acquireLock(acquireTimeout, fn) {
        this._debug("#_acquireLock", "begin", acquireTimeout);
        try {
          if (this.lockAcquired) {
            const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
            const result = (async () => {
              await last;
              return await fn();
            })();
            this.pendingInLock.push((async () => {
              try {
                await result;
              } catch (e) {
              }
            })());
            return result;
          }
          return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
            this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
            try {
              this.lockAcquired = true;
              const result = fn();
              this.pendingInLock.push((async () => {
                try {
                  await result;
                } catch (e) {
                }
              })());
              await result;
              while (this.pendingInLock.length) {
                const waitOn = [...this.pendingInLock];
                await Promise.all(waitOn);
                this.pendingInLock.splice(0, waitOn.length);
              }
              return await result;
            } finally {
              this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
              this.lockAcquired = false;
            }
          });
        } finally {
          this._debug("#_acquireLock", "end");
        }
      }
      /**
       * Use instead of {@link #getSession} inside the library. It is
       * semantically usually what you want, as getting a session involves some
       * processing afterwards that requires only one client operating on the
       * session at once across multiple tabs or processes.
       */
      async _useSession(fn) {
        this._debug("#_useSession", "begin");
        try {
          const result = await this.__loadSession();
          return await fn(result);
        } finally {
          this._debug("#_useSession", "end");
        }
      }
      /**
       * NEVER USE DIRECTLY!
       *
       * Always use {@link #_useSession}.
       */
      async __loadSession() {
        this._debug("#__loadSession()", "begin");
        if (!this.lockAcquired) {
          this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
        }
        try {
          let currentSession = null;
          if (this.persistSession) {
            const maybeSession = await getItemAsync(this.storage, this.storageKey);
            this._debug("#getSession()", "session from storage", maybeSession);
            if (maybeSession !== null) {
              if (this._isValidSession(maybeSession)) {
                currentSession = maybeSession;
              } else {
                this._debug("#getSession()", "session from storage is not valid");
                await this._removeSession();
              }
            }
          } else {
            currentSession = this.inMemorySession;
            this._debug("#getSession()", "session from memory", currentSession);
          }
          if (!currentSession) {
            return { data: { session: null }, error: null };
          }
          const hasExpired = currentSession.expires_at ? currentSession.expires_at <= Date.now() / 1e3 : false;
          this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
          if (!hasExpired) {
            return { data: { session: currentSession }, error: null };
          }
          const { session: session2, error: error2 } = await this._callRefreshToken(currentSession.refresh_token);
          if (error2) {
            return { data: { session: null }, error: error2 };
          }
          return { data: { session: session2 }, error: null };
        } finally {
          this._debug("#__loadSession()", "end");
        }
      }
      /**
       * Gets the current user details if there is an existing session.
       * @param jwt Takes in an optional access token jwt. If no jwt is provided, getUser() will attempt to get the jwt from the current session.
       */
      async getUser(jwt) {
        if (jwt) {
          return await this._getUser(jwt);
        }
        await this.initializePromise;
        return this._acquireLock(-1, async () => {
          return await this._getUser();
        });
      }
      async _getUser(jwt) {
        try {
          if (jwt) {
            return await _request(this.fetch, "GET", `${this.url}/user`, {
              headers: this.headers,
              jwt,
              xform: _userResponse
            });
          }
          return await this._useSession(async (result) => {
            var _a, _b;
            const { data, error: error2 } = result;
            if (error2) {
              throw error2;
            }
            return await _request(this.fetch, "GET", `${this.url}/user`, {
              headers: this.headers,
              jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0,
              xform: _userResponse
            });
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Updates user data for a logged in user.
       */
      async updateUser(attributes, options2 = {}) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._updateUser(attributes, options2);
        });
      }
      async _updateUser(attributes, options2 = {}) {
        try {
          return await this._useSession(async (result) => {
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              throw sessionError;
            }
            if (!sessionData.session) {
              throw new AuthSessionMissingError();
            }
            const session2 = sessionData.session;
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === "pkce" && attributes.email != null) {
              const codeVerifier = generatePKCEVerifier();
              await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
              codeChallenge = await generatePKCEChallenge(codeVerifier);
              codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
            }
            const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
              headers: this.headers,
              redirectTo: options2 === null || options2 === void 0 ? void 0 : options2.emailRedirectTo,
              body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
              jwt: session2.access_token,
              xform: _userResponse
            });
            if (userError)
              throw userError;
            session2.user = data.user;
            await this._saveSession(session2);
            await this._notifyAllSubscribers("USER_UPDATED", session2);
            return { data: { user: session2.user }, error: null };
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Decodes a JWT (without performing any validation).
       */
      _decodeJWT(jwt) {
        return decodeJWTPayload(jwt);
      }
      /**
       * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
       * If the refresh token or access token in the current session is invalid, an error will be thrown.
       * @param currentSession The current session that minimally contains an access token and refresh token.
       */
      async setSession(currentSession) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._setSession(currentSession);
        });
      }
      async _setSession(currentSession) {
        try {
          if (!currentSession.access_token || !currentSession.refresh_token) {
            throw new AuthSessionMissingError();
          }
          const timeNow = Date.now() / 1e3;
          let expiresAt2 = timeNow;
          let hasExpired = true;
          let session2 = null;
          const payload = decodeJWTPayload(currentSession.access_token);
          if (payload.exp) {
            expiresAt2 = payload.exp;
            hasExpired = expiresAt2 <= timeNow;
          }
          if (hasExpired) {
            const { session: refreshedSession, error: error2 } = await this._callRefreshToken(currentSession.refresh_token);
            if (error2) {
              return { data: { user: null, session: null }, error: error2 };
            }
            if (!refreshedSession) {
              return { data: { user: null, session: null }, error: null };
            }
            session2 = refreshedSession;
          } else {
            const { data, error: error2 } = await this._getUser(currentSession.access_token);
            if (error2) {
              throw error2;
            }
            session2 = {
              access_token: currentSession.access_token,
              refresh_token: currentSession.refresh_token,
              user: data.user,
              token_type: "bearer",
              expires_in: expiresAt2 - timeNow,
              expires_at: expiresAt2
            };
            await this._saveSession(session2);
            await this._notifyAllSubscribers("SIGNED_IN", session2);
          }
          return { data: { user: session2.user, session: session2 }, error: null };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { session: null, user: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Returns a new session, regardless of expiry status.
       * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
       * If the current session's refresh token is invalid, an error will be thrown.
       * @param currentSession The current session. If passed in, it must contain a refresh token.
       */
      async refreshSession(currentSession) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._refreshSession(currentSession);
        });
      }
      async _refreshSession(currentSession) {
        try {
          return await this._useSession(async (result) => {
            var _a;
            if (!currentSession) {
              const { data, error: error3 } = result;
              if (error3) {
                throw error3;
              }
              currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
            }
            if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
              throw new AuthSessionMissingError();
            }
            const { session: session2, error: error2 } = await this._callRefreshToken(currentSession.refresh_token);
            if (error2) {
              return { data: { user: null, session: null }, error: error2 };
            }
            if (!session2) {
              return { data: { user: null, session: null }, error: null };
            }
            return { data: { user: session2.user, session: session2 }, error: null };
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { user: null, session: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Gets the session data from a URL string
       */
      async _getSessionFromURL(isPKCEFlow) {
        try {
          if (!isBrowser())
            throw new AuthImplicitGrantRedirectError("No browser detected.");
          if (this.flowType === "implicit" && !this._isImplicitGrantFlow()) {
            throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
          } else if (this.flowType == "pkce" && !isPKCEFlow) {
            throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
          }
          const params = parseParametersFromURL(window.location.href);
          if (isPKCEFlow) {
            if (!params.code)
              throw new AuthPKCEGrantCodeExchangeError("No code detected.");
            const { data: data2, error: error3 } = await this._exchangeCodeForSession(params.code);
            if (error3)
              throw error3;
            const url = new URL(window.location.href);
            url.searchParams.delete("code");
            window.history.replaceState(window.history.state, "", url.toString());
            return { data: { session: data2.session, redirectType: null }, error: null };
          }
          if (params.error || params.error_description || params.error_code) {
            throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
              error: params.error || "unspecified_error",
              code: params.error_code || "unspecified_code"
            });
          }
          const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
          if (!access_token || !expires_in || !refresh_token || !token_type) {
            throw new AuthImplicitGrantRedirectError("No session defined in URL");
          }
          const timeNow = Math.round(Date.now() / 1e3);
          const expiresIn = parseInt(expires_in);
          let expiresAt2 = timeNow + expiresIn;
          if (expires_at) {
            expiresAt2 = parseInt(expires_at);
          }
          const actuallyExpiresIn = expiresAt2 - timeNow;
          if (actuallyExpiresIn * 1e3 <= AUTO_REFRESH_TICK_DURATION) {
            console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
          }
          const issuedAt = expiresAt2 - expiresIn;
          if (timeNow - issuedAt >= 120) {
            console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt2, timeNow);
          } else if (timeNow - issuedAt < 0) {
            console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clok for skew", issuedAt, expiresAt2, timeNow);
          }
          const { data, error: error2 } = await this._getUser(access_token);
          if (error2)
            throw error2;
          const session2 = {
            provider_token,
            provider_refresh_token,
            access_token,
            expires_in: expiresIn,
            expires_at: expiresAt2,
            refresh_token,
            token_type,
            user: data.user
          };
          window.location.hash = "";
          this._debug("#_getSessionFromURL()", "clearing window.location.hash");
          return { data: { session: session2, redirectType: params.type }, error: null };
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: { session: null, redirectType: null }, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
       */
      _isImplicitGrantFlow() {
        const params = parseParametersFromURL(window.location.href);
        return !!(isBrowser() && (params.access_token || params.error_description));
      }
      /**
       * Checks if the current URL and backing storage contain parameters given by a PKCE flow
       */
      async _isPKCEFlow() {
        const params = parseParametersFromURL(window.location.href);
        const currentStorageContent = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        return !!(params.code && currentStorageContent);
      }
      /**
       * Inside a browser context, `signOut()` will remove the logged in user from the browser session
       * and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
       *
       * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
       * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
       *
       * If using others scope, no `SIGNED_OUT` event is fired!
       */
      async signOut(options2 = { scope: "global" }) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._signOut(options2);
        });
      }
      async _signOut({ scope } = { scope: "global" }) {
        return await this._useSession(async (result) => {
          var _a;
          const { data, error: sessionError } = result;
          if (sessionError) {
            return { error: sessionError };
          }
          const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
          if (accessToken) {
            const { error: error2 } = await this.admin.signOut(accessToken, scope);
            if (error2) {
              if (!(isAuthApiError(error2) && (error2.status === 404 || error2.status === 401))) {
                return { error: error2 };
              }
            }
          }
          if (scope !== "others") {
            await this._removeSession();
            await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
            await this._notifyAllSubscribers("SIGNED_OUT", null);
          }
          return { error: null };
        });
      }
      /**
       * Receive a notification every time an auth event happens.
       * @param callback A callback function to be invoked when an auth event happens.
       */
      onAuthStateChange(callback) {
        const id = uuid();
        const subscription = {
          id,
          callback,
          unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", id);
            this.stateChangeEmitters.delete(id);
          }
        };
        this._debug("#onAuthStateChange()", "registered callback with id", id);
        this.stateChangeEmitters.set(id, subscription);
        (async () => {
          await this.initializePromise;
          await this._acquireLock(-1, async () => {
            this._emitInitialSession(id);
          });
        })();
        return { data: { subscription } };
      }
      async _emitInitialSession(id) {
        return await this._useSession(async (result) => {
          var _a, _b;
          try {
            const { data: { session: session2 }, error: error2 } = result;
            if (error2)
              throw error2;
            await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session2));
            this._debug("INITIAL_SESSION", "callback id", id, "session", session2);
          } catch (err) {
            await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
            this._debug("INITIAL_SESSION", "callback id", id, "error", err);
            console.error(err);
          }
        });
      }
      /**
       * Sends a password reset request to an email address.
       * This method supports the PKCE flow.
       * @param email The email address of the user.
       * @param options.redirectTo The URL to send the user to after they click the password reset link.
       * @param options.captchaToken Verification token received when the user completes the captcha on the site.
       */
      async resetPasswordForEmail(email, options2 = {}) {
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          const codeVerifier = generatePKCEVerifier();
          await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
          codeChallenge = await generatePKCEChallenge(codeVerifier);
          codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
        }
        try {
          return await _request(this.fetch, "POST", `${this.url}/recover`, {
            body: {
              email,
              code_challenge: codeChallenge,
              code_challenge_method: codeChallengeMethod,
              gotrue_meta_security: { captcha_token: options2.captchaToken }
            },
            headers: this.headers,
            redirectTo: options2.redirectTo
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: null, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * Generates a new JWT.
       * @param refreshToken A valid refresh token that was returned on login.
       */
      async _refreshAccessToken(refreshToken) {
        const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
        this._debug(debugName, "begin");
        try {
          const startedAt = Date.now();
          return await retryable(async (attempt) => {
            await sleep(attempt * 200);
            this._debug(debugName, "refreshing attempt", attempt);
            return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
              body: { refresh_token: refreshToken },
              headers: this.headers,
              xform: _sessionResponse
            });
          }, (attempt, _, result) => result && result.error && isAuthRetryableFetchError(result.error) && // retryable only if the request can be sent before the backoff overflows the tick duration
          Date.now() + (attempt + 1) * 200 - startedAt < AUTO_REFRESH_TICK_DURATION);
        } catch (error2) {
          this._debug(debugName, "error", error2);
          if (isAuthError(error2)) {
            return { data: { session: null, user: null }, error: error2 };
          }
          throw error2;
        } finally {
          this._debug(debugName, "end");
        }
      }
      _isValidSession(maybeSession) {
        const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
        return isValidSession;
      }
      async _handleProviderSignIn(provider, options2) {
        const url = await this._getUrlForProvider(provider, {
          redirectTo: options2.redirectTo,
          scopes: options2.scopes,
          queryParams: options2.queryParams
        });
        this._debug("#_handleProviderSignIn()", "provider", provider, "options", options2, "url", url);
        if (isBrowser() && !options2.skipBrowserRedirect) {
          window.location.assign(url);
        }
        return { data: { provider, url }, error: null };
      }
      /**
       * Recovers the session from LocalStorage and refreshes
       * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
       */
      async _recoverAndRefresh() {
        var _a;
        const debugName = "#_recoverAndRefresh()";
        this._debug(debugName, "begin");
        try {
          const currentSession = await getItemAsync(this.storage, this.storageKey);
          this._debug(debugName, "session from storage", currentSession);
          if (!this._isValidSession(currentSession)) {
            this._debug(debugName, "session is not valid");
            if (currentSession !== null) {
              await this._removeSession();
            }
            return;
          }
          const timeNow = Math.round(Date.now() / 1e3);
          const expiresWithMargin = ((_a = currentSession.expires_at) !== null && _a !== void 0 ? _a : Infinity) < timeNow + EXPIRY_MARGIN;
          this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN}s`);
          if (expiresWithMargin) {
            if (this.autoRefreshToken && currentSession.refresh_token) {
              const { error: error2 } = await this._callRefreshToken(currentSession.refresh_token);
              if (error2) {
                console.error(error2);
                if (!isAuthRetryableFetchError(error2)) {
                  this._debug(debugName, "refresh failed with a non-retryable error, removing the session", error2);
                  await this._removeSession();
                }
              }
            }
          } else {
            await this._notifyAllSubscribers("SIGNED_IN", currentSession);
          }
        } catch (err) {
          this._debug(debugName, "error", err);
          console.error(err);
          return;
        } finally {
          this._debug(debugName, "end");
        }
      }
      async _callRefreshToken(refreshToken) {
        var _a, _b;
        if (!refreshToken) {
          throw new AuthSessionMissingError();
        }
        if (this.refreshingDeferred) {
          return this.refreshingDeferred.promise;
        }
        const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
        this._debug(debugName, "begin");
        try {
          this.refreshingDeferred = new Deferred();
          const { data, error: error2 } = await this._refreshAccessToken(refreshToken);
          if (error2)
            throw error2;
          if (!data.session)
            throw new AuthSessionMissingError();
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
          const result = { session: data.session, error: null };
          this.refreshingDeferred.resolve(result);
          return result;
        } catch (error2) {
          this._debug(debugName, "error", error2);
          if (isAuthError(error2)) {
            const result = { session: null, error: error2 };
            (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
            return result;
          }
          (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error2);
          throw error2;
        } finally {
          this.refreshingDeferred = null;
          this._debug(debugName, "end");
        }
      }
      async _notifyAllSubscribers(event, session2, broadcast = true) {
        const debugName = `#_notifyAllSubscribers(${event})`;
        this._debug(debugName, "begin", session2, `broadcast = ${broadcast}`);
        try {
          if (this.broadcastChannel && broadcast) {
            this.broadcastChannel.postMessage({ event, session: session2 });
          }
          const errors = [];
          const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
            try {
              await x.callback(event, session2);
            } catch (e) {
              errors.push(e);
            }
          });
          await Promise.all(promises);
          if (errors.length > 0) {
            for (let i = 0; i < errors.length; i += 1) {
              console.error(errors[i]);
            }
            throw errors[0];
          }
        } finally {
          this._debug(debugName, "end");
        }
      }
      /**
       * set currentSession and currentUser
       * process to _startAutoRefreshToken if possible
       */
      async _saveSession(session2) {
        this._debug("#_saveSession()", session2);
        if (!this.persistSession) {
          this.inMemorySession = session2;
        }
        if (this.persistSession && session2.expires_at) {
          await this._persistSession(session2);
        }
      }
      _persistSession(currentSession) {
        this._debug("#_persistSession()", currentSession);
        return setItemAsync(this.storage, this.storageKey, currentSession);
      }
      async _removeSession() {
        this._debug("#_removeSession()");
        if (this.persistSession) {
          await removeItemAsync(this.storage, this.storageKey);
        } else {
          this.inMemorySession = null;
        }
      }
      /**
       * Removes any registered visibilitychange callback.
       *
       * {@see #startAutoRefresh}
       * {@see #stopAutoRefresh}
       */
      _removeVisibilityChangedCallback() {
        this._debug("#_removeVisibilityChangedCallback()");
        const callback = this.visibilityChangedCallback;
        this.visibilityChangedCallback = null;
        try {
          if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
            window.removeEventListener("visibilitychange", callback);
          }
        } catch (e) {
          console.error("removing visibilitychange callback failed", e);
        }
      }
      /**
       * This is the private implementation of {@link #startAutoRefresh}. Use this
       * within the library.
       */
      async _startAutoRefresh() {
        await this._stopAutoRefresh();
        this._debug("#_startAutoRefresh()");
        const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION);
        this.autoRefreshTicker = ticker;
        if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
          ticker.unref();
        } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
          Deno.unrefTimer(ticker);
        }
        setTimeout(async () => {
          await this.initializePromise;
          await this._autoRefreshTokenTick();
        }, 0);
      }
      /**
       * This is the private implementation of {@link #stopAutoRefresh}. Use this
       * within the library.
       */
      async _stopAutoRefresh() {
        this._debug("#_stopAutoRefresh()");
        const ticker = this.autoRefreshTicker;
        this.autoRefreshTicker = null;
        if (ticker) {
          clearInterval(ticker);
        }
      }
      /**
       * Starts an auto-refresh process in the background. The session is checked
       * every few seconds. Close to the time of expiration a process is started to
       * refresh the session. If refreshing fails it will be retried for as long as
       * necessary.
       *
       * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
       * to call this function, it will be called for you.
       *
       * On browsers the refresh process works only when the tab/window is in the
       * foreground to conserve resources as well as prevent race conditions and
       * flooding auth with requests. If you call this method any managed
       * visibility change callback will be removed and you must manage visibility
       * changes on your own.
       *
       * On non-browser platforms the refresh process works *continuously* in the
       * background, which may not be desirable. You should hook into your
       * platform's foreground indication mechanism and call these methods
       * appropriately to conserve resources.
       *
       * {@see #stopAutoRefresh}
       */
      async startAutoRefresh() {
        this._removeVisibilityChangedCallback();
        await this._startAutoRefresh();
      }
      /**
       * Stops an active auto refresh process running in the background (if any).
       *
       * If you call this method any managed visibility change callback will be
       * removed and you must manage visibility changes on your own.
       *
       * See {@link #startAutoRefresh} for more details.
       */
      async stopAutoRefresh() {
        this._removeVisibilityChangedCallback();
        await this._stopAutoRefresh();
      }
      /**
       * Runs the auto refresh token tick.
       */
      async _autoRefreshTokenTick() {
        this._debug("#_autoRefreshTokenTick()", "begin");
        try {
          await this._acquireLock(0, async () => {
            try {
              const now = Date.now();
              try {
                return await this._useSession(async (result) => {
                  const { data: { session: session2 } } = result;
                  if (!session2 || !session2.refresh_token || !session2.expires_at) {
                    this._debug("#_autoRefreshTokenTick()", "no session");
                    return;
                  }
                  const expiresInTicks = Math.floor((session2.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION);
                  this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
                  if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                    await this._callRefreshToken(session2.refresh_token);
                  }
                });
              } catch (e) {
                console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
              }
            } finally {
              this._debug("#_autoRefreshTokenTick()", "end");
            }
          });
        } catch (e) {
          if (e.isAcquireTimeout || e instanceof LockAcquireTimeoutError) {
            this._debug("auto refresh token tick lock not available");
          } else {
            throw e;
          }
        }
      }
      /**
       * Registers callbacks on the browser / platform, which in-turn run
       * algorithms when the browser window/tab are in foreground. On non-browser
       * platforms it assumes always foreground.
       */
      async _handleVisibilityChange() {
        this._debug("#_handleVisibilityChange()");
        if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
          if (this.autoRefreshToken) {
            this.startAutoRefresh();
          }
          return false;
        }
        try {
          this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
          window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
          await this._onVisibilityChanged(true);
        } catch (error2) {
          console.error("_handleVisibilityChange", error2);
        }
      }
      /**
       * Callback registered with `window.addEventListener('visibilitychange')`.
       */
      async _onVisibilityChanged(calledFromInitialize) {
        const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
        this._debug(methodName, "visibilityState", document.visibilityState);
        if (document.visibilityState === "visible") {
          if (this.autoRefreshToken) {
            this._startAutoRefresh();
          }
          if (!calledFromInitialize) {
            await this.initializePromise;
            await this._acquireLock(-1, async () => {
              if (document.visibilityState !== "visible") {
                this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
                return;
              }
              await this._recoverAndRefresh();
            });
          }
        } else if (document.visibilityState === "hidden") {
          if (this.autoRefreshToken) {
            this._stopAutoRefresh();
          }
        }
      }
      /**
       * Generates the relevant login URL for a third-party provider.
       * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
       * @param options.scopes A space-separated list of scopes granted to the OAuth application.
       * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
       */
      async _getUrlForProvider(provider, options2) {
        const urlParams = [`provider=${encodeURIComponent(provider)}`];
        if (options2 === null || options2 === void 0 ? void 0 : options2.redirectTo) {
          urlParams.push(`redirect_to=${encodeURIComponent(options2.redirectTo)}`);
        }
        if (options2 === null || options2 === void 0 ? void 0 : options2.scopes) {
          urlParams.push(`scopes=${encodeURIComponent(options2.scopes)}`);
        }
        if (this.flowType === "pkce") {
          const codeVerifier = generatePKCEVerifier();
          await setItemAsync(this.storage, `${this.storageKey}-code-verifier`, codeVerifier);
          const codeChallenge = await generatePKCEChallenge(codeVerifier);
          const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
          this._debug("PKCE", "code verifier", `${codeVerifier.substring(0, 5)}...`, "code challenge", codeChallenge, "method", codeChallengeMethod);
          const flowParams = new URLSearchParams({
            code_challenge: `${encodeURIComponent(codeChallenge)}`,
            code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
          });
          urlParams.push(flowParams.toString());
        }
        if (options2 === null || options2 === void 0 ? void 0 : options2.queryParams) {
          const query = new URLSearchParams(options2.queryParams);
          urlParams.push(query.toString());
        }
        return `${this.url}/authorize?${urlParams.join("&")}`;
      }
      async _unenroll(params) {
        try {
          return await this._useSession(async (result) => {
            var _a;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return { data: null, error: sessionError };
            }
            return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: null, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * {@see GoTrueMFAApi#enroll}
       */
      async _enroll(params) {
        try {
          return await this._useSession(async (result) => {
            var _a, _b;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return { data: null, error: sessionError };
            }
            const { data, error: error2 } = await _request(this.fetch, "POST", `${this.url}/factors`, {
              body: {
                friendly_name: params.friendlyName,
                factor_type: params.factorType,
                issuer: params.issuer
              },
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
            if (error2) {
              return { data: null, error: error2 };
            }
            if ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code) {
              data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
            }
            return { data, error: null };
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: null, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * {@see GoTrueMFAApi#verify}
       */
      async _verify(params) {
        try {
          return await this._useSession(async (result) => {
            var _a;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return { data: null, error: sessionError };
            }
            const { data, error: error2 } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
              body: { code: params.code, challenge_id: params.challengeId },
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
            if (error2) {
              return { data: null, error: error2 };
            }
            await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
            await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
            return { data, error: error2 };
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: null, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * {@see GoTrueMFAApi#challenge}
       */
      async _challenge(params) {
        try {
          return await this._useSession(async (result) => {
            var _a;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return { data: null, error: sessionError };
            }
            return await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
          });
        } catch (error2) {
          if (isAuthError(error2)) {
            return { data: null, error: error2 };
          }
          throw error2;
        }
      }
      /**
       * {@see GoTrueMFAApi#challengeAndVerify}
       */
      async _challengeAndVerify(params) {
        const { data: challengeData, error: challengeError } = await this._challenge({
          factorId: params.factorId
        });
        if (challengeError) {
          return { data: null, error: challengeError };
        }
        return await this._verify({
          factorId: params.factorId,
          challengeId: challengeData.id,
          code: params.code
        });
      }
      /**
       * {@see GoTrueMFAApi#listFactors}
       */
      async _listFactors() {
        const { data: { user }, error: userError } = await this._getUser();
        if (userError) {
          return { data: null, error: userError };
        }
        const factors = (user === null || user === void 0 ? void 0 : user.factors) || [];
        const totp = factors.filter((factor) => factor.factor_type === "totp" && factor.status === "verified");
        return {
          data: {
            all: factors,
            totp
          },
          error: null
        };
      }
      /**
       * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
       */
      async _getAuthenticatorAssuranceLevel() {
        return await this._useSession(async (result) => {
          var _a, _b;
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return { data: null, error: sessionError };
          }
          if (!session2) {
            return {
              data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
              error: null
            };
          }
          const payload = this._decodeJWT(session2.access_token);
          let currentLevel = null;
          if (payload.aal) {
            currentLevel = payload.aal;
          }
          let nextLevel = currentLevel;
          const verifiedFactors = (_b = (_a = session2.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
          if (verifiedFactors.length > 0) {
            nextLevel = "aal2";
          }
          const currentAuthenticationMethods = payload.amr || [];
          return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
        });
      }
    };
    GoTrueClient.nextInstanceID = 0;
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/types.js
var init_types3 = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/lib/types.js"() {
  }
});

// node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/index.js
var init_module5 = __esm({
  "node_modules/.pnpm/@supabase+gotrue-js@2.52.0/node_modules/@supabase/gotrue-js/dist/module/index.js"() {
    init_GoTrueAdminApi();
    init_GoTrueClient();
    init_types3();
    init_errors3();
    init_locks();
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js
var SupabaseAuthClient;
var init_SupabaseAuthClient = __esm({
  "node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js"() {
    init_module5();
    SupabaseAuthClient = class extends GoTrueClient {
      constructor(options2) {
        super(options2);
      }
    };
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js
var __awaiter9, DEFAULT_GLOBAL_OPTIONS, DEFAULT_DB_OPTIONS, DEFAULT_AUTH_OPTIONS, DEFAULT_REALTIME_OPTIONS, SupabaseClient;
var init_SupabaseClient = __esm({
  "node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js"() {
    init_module();
    init_module2();
    init_module3();
    init_module4();
    init_constants4();
    init_fetch2();
    init_helpers2();
    init_SupabaseAuthClient();
    __awaiter9 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    DEFAULT_GLOBAL_OPTIONS = {
      headers: DEFAULT_HEADERS4
    };
    DEFAULT_DB_OPTIONS = {
      schema: "public"
    };
    DEFAULT_AUTH_OPTIONS = {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "implicit"
    };
    DEFAULT_REALTIME_OPTIONS = {};
    SupabaseClient = class {
      /**
       * Create a new client for use in the browser.
       * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
       * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
       * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
       * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
       * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
       * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
       * @param options.realtime Options passed along to realtime-js constructor.
       * @param options.global.fetch A custom fetch implementation.
       * @param options.global.headers Any additional headers to send with each network request.
       */
      constructor(supabaseUrl, supabaseKey, options2) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        if (!supabaseUrl)
          throw new Error("supabaseUrl is required.");
        if (!supabaseKey)
          throw new Error("supabaseKey is required.");
        const _supabaseUrl = stripTrailingSlash(supabaseUrl);
        this.realtimeUrl = `${_supabaseUrl}/realtime/v1`.replace(/^http/i, "ws");
        this.authUrl = `${_supabaseUrl}/auth/v1`;
        this.storageUrl = `${_supabaseUrl}/storage/v1`;
        this.functionsUrl = `${_supabaseUrl}/functions/v1`;
        const defaultStorageKey = `sb-${new URL(this.authUrl).hostname.split(".")[0]}-auth-token`;
        const DEFAULTS = {
          db: DEFAULT_DB_OPTIONS,
          realtime: DEFAULT_REALTIME_OPTIONS,
          auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
          global: DEFAULT_GLOBAL_OPTIONS
        };
        const settings = applySettingDefaults(options2 !== null && options2 !== void 0 ? options2 : {}, DEFAULTS);
        this.storageKey = (_b = (_a = settings.auth) === null || _a === void 0 ? void 0 : _a.storageKey) !== null && _b !== void 0 ? _b : "";
        this.headers = (_d = (_c = settings.global) === null || _c === void 0 ? void 0 : _c.headers) !== null && _d !== void 0 ? _d : {};
        this.auth = this._initSupabaseAuthClient((_e = settings.auth) !== null && _e !== void 0 ? _e : {}, this.headers, (_f = settings.global) === null || _f === void 0 ? void 0 : _f.fetch);
        this.fetch = fetchWithAuth(supabaseKey, this._getAccessToken.bind(this), (_g = settings.global) === null || _g === void 0 ? void 0 : _g.fetch);
        this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers }, settings.realtime));
        this.rest = new PostgrestClient(`${_supabaseUrl}/rest/v1`, {
          headers: this.headers,
          schema: (_h = settings.db) === null || _h === void 0 ? void 0 : _h.schema,
          fetch: this.fetch
        });
        this._listenForAuthEvents();
      }
      /**
       * Supabase Functions allows you to deploy and invoke edge functions.
       */
      get functions() {
        return new FunctionsClient(this.functionsUrl, {
          headers: this.headers,
          customFetch: this.fetch
        });
      }
      /**
       * Supabase Storage allows you to manage user-generated content, such as photos or videos.
       */
      get storage() {
        return new StorageClient(this.storageUrl, this.headers, this.fetch);
      }
      /**
       * Perform a query on a table or a view.
       *
       * @param relation - The table or view name to query
       */
      from(relation) {
        return this.rest.from(relation);
      }
      /**
       * Perform a query on a schema distinct from the default schema supplied via
       * the `options.db.schema` constructor parameter.
       *
       * The schema needs to be on the list of exposed schemas inside Supabase.
       *
       * @param schema - The name of the schema to query
       */
      schema(schema) {
        return this.rest.schema(schema);
      }
      /**
       * Perform a function call.
       *
       * @param fn - The function name to call
       * @param args - The arguments to pass to the function call
       * @param options - Named parameters
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       * @param options.count - Count algorithm to use to count rows returned by the
       * function. Only applicable for [set-returning
       * functions](https://www.postgresql.org/docs/current/functions-srf.html).
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      rpc(fn, args = {}, options2) {
        return this.rest.rpc(fn, args, options2);
      }
      /**
       * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
       *
       * @param {string} name - The name of the Realtime channel.
       * @param {Object} opts - The options to pass to the Realtime channel.
       *
       */
      channel(name, opts = { config: {} }) {
        return this.realtime.channel(name, opts);
      }
      /**
       * Returns all Realtime channels.
       */
      getChannels() {
        return this.realtime.getChannels();
      }
      /**
       * Unsubscribes and removes Realtime channel from Realtime client.
       *
       * @param {RealtimeChannel} channel - The name of the Realtime channel.
       *
       */
      removeChannel(channel) {
        return this.realtime.removeChannel(channel);
      }
      /**
       * Unsubscribes and removes all Realtime channels from Realtime client.
       */
      removeAllChannels() {
        return this.realtime.removeAllChannels();
      }
      _getAccessToken() {
        var _a, _b;
        return __awaiter9(this, void 0, void 0, function* () {
          const { data } = yield this.auth.getSession();
          return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : null;
        });
      }
      _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage: storage2, storageKey, flowType, debug }, headers, fetch2) {
        const authHeaders = {
          Authorization: `Bearer ${this.supabaseKey}`,
          apikey: `${this.supabaseKey}`
        };
        return new SupabaseAuthClient({
          url: this.authUrl,
          headers: Object.assign(Object.assign({}, authHeaders), headers),
          storageKey,
          autoRefreshToken,
          persistSession,
          detectSessionInUrl,
          storage: storage2,
          flowType,
          debug,
          fetch: fetch2
        });
      }
      _initRealtimeClient(options2) {
        return new RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options2), { params: Object.assign({ apikey: this.supabaseKey }, options2 === null || options2 === void 0 ? void 0 : options2.params) }));
      }
      _listenForAuthEvents() {
        let data = this.auth.onAuthStateChange((event, session2) => {
          this._handleTokenChanged(event, "CLIENT", session2 === null || session2 === void 0 ? void 0 : session2.access_token);
        });
        return data;
      }
      _handleTokenChanged(event, source, token) {
        if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
          this.realtime.setAuth(token !== null && token !== void 0 ? token : null);
          this.changedAccessToken = token;
        } else if (event === "SIGNED_OUT") {
          this.realtime.setAuth(this.supabaseKey);
          if (source == "STORAGE")
            this.auth.signOut();
          this.changedAccessToken = void 0;
        }
      }
    };
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/index.js
var createClient;
var init_module6 = __esm({
  "node_modules/.pnpm/@supabase+supabase-js@2.33.2/node_modules/@supabase/supabase-js/dist/module/index.js"() {
    init_SupabaseClient();
    init_module5();
    init_module3();
    createClient = (supabaseUrl, supabaseKey, options2) => {
      return new SupabaseClient(supabaseUrl, supabaseKey, options2);
    };
  }
});

// node_modules/.pnpm/@supabase+auth-helpers-shared@0.5.0_@supabase+supabase-js@2.33.2/node_modules/@supabase/auth-helpers-shared/dist/index.mjs
function parseSupabaseCookie(str) {
  if (!str) {
    return null;
  }
  try {
    const session2 = JSON.parse(str);
    if (!session2) {
      return null;
    }
    if (session2.constructor.name === "Object") {
      return session2;
    }
    if (session2.constructor.name !== "Array") {
      throw new Error(`Unexpected format: ${session2.constructor.name}`);
    }
    const [_header, payloadStr, _signature] = session2[0].split(".");
    const payload = base64url_exports2.decode(payloadStr);
    const decoder2 = new TextDecoder();
    const { exp, sub, ...user } = JSON.parse(decoder2.decode(payload));
    return {
      expires_at: exp,
      expires_in: exp - Math.round(Date.now() / 1e3),
      token_type: "bearer",
      access_token: session2[0],
      refresh_token: session2[1],
      provider_token: session2[2],
      provider_refresh_token: session2[3],
      user: {
        id: sub,
        factors: session2[4],
        ...user
      }
    };
  } catch (err) {
    console.warn("Failed to parse cookie string:", err);
    return null;
  }
}
function stringifySupabaseSession(session2) {
  var _a;
  return JSON.stringify([
    session2.access_token,
    session2.refresh_token,
    session2.provider_token,
    session2.provider_refresh_token,
    ((_a = session2.user) == null ? void 0 : _a.factors) ?? null
  ]);
}
function isBrowser2() {
  return typeof window !== "undefined" && typeof window.document !== "undefined";
}
function createSupabaseClient(supabaseUrl, supabaseKey, options2) {
  var _a;
  const browser = isBrowser2();
  return createClient(supabaseUrl, supabaseKey, {
    ...options2,
    auth: {
      flowType: "pkce",
      autoRefreshToken: browser,
      detectSessionInUrl: browser,
      persistSession: true,
      storage: options2.auth.storage,
      // fix this in supabase-js
      ...((_a = options2.auth) == null ? void 0 : _a.storageKey) ? {
        storageKey: options2.auth.storageKey
      } : {}
    }
  });
}
var __create2, __defProp2, __getOwnPropDesc2, __getOwnPropNames2, __getProtoOf2, __hasOwnProp2, __commonJS2, __copyProps2, __toESM2, require_cookie, import_cookie2, import_cookie, DEFAULT_COOKIE_OPTIONS, CookieAuthStorageAdapter, BrowserCookieAuthStorageAdapter, export_parseCookies, export_serializeCookie;
var init_dist = __esm({
  "node_modules/.pnpm/@supabase+auth-helpers-shared@0.5.0_@supabase+supabase-js@2.33.2/node_modules/@supabase/auth-helpers-shared/dist/index.mjs"() {
    init_browser();
    init_module6();
    __create2 = Object.create;
    __defProp2 = Object.defineProperty;
    __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    __getOwnPropNames2 = Object.getOwnPropertyNames;
    __getProtoOf2 = Object.getPrototypeOf;
    __hasOwnProp2 = Object.prototype.hasOwnProperty;
    __commonJS2 = (cb, mod) => function __require() {
      return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    };
    __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key2 of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key2) && key2 !== except)
            __defProp2(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc2(from, key2)) || desc.enumerable });
      }
      return to;
    };
    __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    require_cookie = __commonJS2({
      "../../node_modules/.pnpm/cookie@0.5.0/node_modules/cookie/index.js"(exports) {
        "use strict";
        exports.parse = parse3;
        exports.serialize = serialize3;
        var __toString = Object.prototype.toString;
        var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        function parse3(str, options2) {
          if (typeof str !== "string") {
            throw new TypeError("argument str must be a string");
          }
          var obj = {};
          var opt = options2 || {};
          var dec = opt.decode || decode3;
          var index21 = 0;
          while (index21 < str.length) {
            var eqIdx = str.indexOf("=", index21);
            if (eqIdx === -1) {
              break;
            }
            var endIdx = str.indexOf(";", index21);
            if (endIdx === -1) {
              endIdx = str.length;
            } else if (endIdx < eqIdx) {
              index21 = str.lastIndexOf(";", eqIdx - 1) + 1;
              continue;
            }
            var key2 = str.slice(index21, eqIdx).trim();
            if (void 0 === obj[key2]) {
              var val = str.slice(eqIdx + 1, endIdx).trim();
              if (val.charCodeAt(0) === 34) {
                val = val.slice(1, -1);
              }
              obj[key2] = tryDecode(val, dec);
            }
            index21 = endIdx + 1;
          }
          return obj;
        }
        function serialize3(name, val, options2) {
          var opt = options2 || {};
          var enc = opt.encode || encode4;
          if (typeof enc !== "function") {
            throw new TypeError("option encode is invalid");
          }
          if (!fieldContentRegExp.test(name)) {
            throw new TypeError("argument name is invalid");
          }
          var value = enc(val);
          if (value && !fieldContentRegExp.test(value)) {
            throw new TypeError("argument val is invalid");
          }
          var str = name + "=" + value;
          if (null != opt.maxAge) {
            var maxAge = opt.maxAge - 0;
            if (isNaN(maxAge) || !isFinite(maxAge)) {
              throw new TypeError("option maxAge is invalid");
            }
            str += "; Max-Age=" + Math.floor(maxAge);
          }
          if (opt.domain) {
            if (!fieldContentRegExp.test(opt.domain)) {
              throw new TypeError("option domain is invalid");
            }
            str += "; Domain=" + opt.domain;
          }
          if (opt.path) {
            if (!fieldContentRegExp.test(opt.path)) {
              throw new TypeError("option path is invalid");
            }
            str += "; Path=" + opt.path;
          }
          if (opt.expires) {
            var expires = opt.expires;
            if (!isDate(expires) || isNaN(expires.valueOf())) {
              throw new TypeError("option expires is invalid");
            }
            str += "; Expires=" + expires.toUTCString();
          }
          if (opt.httpOnly) {
            str += "; HttpOnly";
          }
          if (opt.secure) {
            str += "; Secure";
          }
          if (opt.priority) {
            var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
            switch (priority) {
              case "low":
                str += "; Priority=Low";
                break;
              case "medium":
                str += "; Priority=Medium";
                break;
              case "high":
                str += "; Priority=High";
                break;
              default:
                throw new TypeError("option priority is invalid");
            }
          }
          if (opt.sameSite) {
            var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
            switch (sameSite) {
              case true:
                str += "; SameSite=Strict";
                break;
              case "lax":
                str += "; SameSite=Lax";
                break;
              case "strict":
                str += "; SameSite=Strict";
                break;
              case "none":
                str += "; SameSite=None";
                break;
              default:
                throw new TypeError("option sameSite is invalid");
            }
          }
          return str;
        }
        function decode3(str) {
          return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
        }
        function encode4(val) {
          return encodeURIComponent(val);
        }
        function isDate(val) {
          return __toString.call(val) === "[object Date]" || val instanceof Date;
        }
        function tryDecode(str, decode22) {
          try {
            return decode22(str);
          } catch (e) {
            return str;
          }
        }
      }
    });
    import_cookie2 = __toESM2(require_cookie());
    import_cookie = __toESM2(require_cookie());
    DEFAULT_COOKIE_OPTIONS = {
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 1e3
    };
    CookieAuthStorageAdapter = class {
      constructor(cookieOptions) {
        this.cookieOptions = {
          ...DEFAULT_COOKIE_OPTIONS,
          ...cookieOptions,
          maxAge: DEFAULT_COOKIE_OPTIONS.maxAge
        };
      }
      getItem(key2) {
        const value = this.getCookie(key2);
        if (!value)
          return null;
        if (key2.endsWith("-code-verifier")) {
          return value;
        }
        return JSON.stringify(parseSupabaseCookie(value));
      }
      setItem(key2, value) {
        if (key2.endsWith("-code-verifier")) {
          this.setCookie(key2, value);
          return;
        }
        let session2 = JSON.parse(value);
        const sessionStr = stringifySupabaseSession(session2);
        this.setCookie(key2, sessionStr);
      }
      removeItem(key2) {
        this.deleteCookie(key2);
      }
    };
    BrowserCookieAuthStorageAdapter = class extends CookieAuthStorageAdapter {
      constructor(cookieOptions) {
        super(cookieOptions);
      }
      getCookie(name) {
        if (!isBrowser2())
          return null;
        const cookies = (0, import_cookie2.parse)(document.cookie);
        return cookies[name];
      }
      setCookie(name, value) {
        if (!isBrowser2())
          return null;
        document.cookie = (0, import_cookie2.serialize)(name, value, {
          ...this.cookieOptions,
          httpOnly: false
        });
      }
      deleteCookie(name) {
        if (!isBrowser2())
          return null;
        document.cookie = (0, import_cookie2.serialize)(name, "", {
          ...this.cookieOptions,
          maxAge: 0,
          httpOnly: false
        });
      }
    };
    export_parseCookies = import_cookie.parse;
    export_serializeCookie = import_cookie.serialize;
  }
});

// node_modules/.pnpm/@supabase+auth-helpers-sveltekit@0.10.3_@supabase+supabase-js@2.33.2_@sveltejs+kit@1.25.0/node_modules/@supabase/auth-helpers-sveltekit/dist/index.js
function createSupabaseLoadClient({
  supabaseUrl,
  supabaseKey,
  event,
  serverSession,
  options: options2,
  cookieOptions
}) {
  var _a;
  const browser = isBrowser2();
  if (browser && cachedBrowserClient) {
    return cachedBrowserClient;
  }
  const client = createSupabaseClient(supabaseUrl, supabaseKey, {
    ...options2,
    global: {
      fetch: event.fetch,
      ...options2 == null ? void 0 : options2.global,
      headers: {
        ...(_a = options2 == null ? void 0 : options2.global) == null ? void 0 : _a.headers,
        "X-Client-Info": `${"@supabase/auth-helpers-sveltekit"}@${"0.10.3"}`
      }
    },
    auth: {
      storageKey: cookieOptions == null ? void 0 : cookieOptions.name,
      storage: new SvelteKitLoadAuthStorageAdapter(serverSession, cookieOptions)
    }
  });
  if (browser) {
    cachedBrowserClient = client;
  }
  return client;
}
function createSupabaseServerClient({
  supabaseUrl,
  supabaseKey,
  event,
  options: options2,
  cookieOptions,
  expiryMargin
}) {
  var _a;
  const client = createSupabaseClient(supabaseUrl, supabaseKey, {
    ...options2,
    global: {
      ...options2 == null ? void 0 : options2.global,
      headers: {
        ...(_a = options2 == null ? void 0 : options2.global) == null ? void 0 : _a.headers,
        "X-Client-Info": `${"@supabase/auth-helpers-sveltekit"}@${"0.10.3"}`
      }
    },
    auth: {
      storageKey: cookieOptions == null ? void 0 : cookieOptions.name,
      storage: new SvelteKitServerAuthStorageAdapter(event, cookieOptions, expiryMargin)
    }
  });
  return client;
}
var SvelteKitLoadAuthStorageAdapter, cachedBrowserClient, SvelteKitServerAuthStorageAdapter;
var init_dist2 = __esm({
  "node_modules/.pnpm/@supabase+auth-helpers-sveltekit@0.10.3_@supabase+supabase-js@2.33.2_@sveltejs+kit@1.25.0/node_modules/@supabase/auth-helpers-sveltekit/dist/index.js"() {
    init_dist();
    init_dist();
    init_dist();
    init_dist();
    SvelteKitLoadAuthStorageAdapter = class extends BrowserCookieAuthStorageAdapter {
      constructor(serverSession = null, cookieOptions) {
        super(cookieOptions);
        this.serverSession = serverSession;
      }
      getItem(key2) {
        if (!isBrowser2()) {
          return JSON.stringify(this.serverSession);
        }
        return super.getItem(key2);
      }
    };
    SvelteKitServerAuthStorageAdapter = class extends CookieAuthStorageAdapter {
      constructor(event, cookieOptions, expiryMargin = 60) {
        super(cookieOptions);
        this.event = event;
        this.expiryMargin = expiryMargin;
        this.isInitialDelete = true;
        this.currentSession = null;
      }
      getCookie(name) {
        return this.event.cookies.get(name);
      }
      setCookie(name, value) {
        this.event.cookies.set(name, value, {
          httpOnly: false,
          ...this.cookieOptions
        });
      }
      deleteCookie(name) {
        this.event.cookies.delete(name, {
          httpOnly: false,
          ...this.cookieOptions
        });
      }
      async getItem(key2) {
        const sessionStr = await super.getItem(key2);
        if (!sessionStr) {
          this.currentSession = null;
          return null;
        }
        const session2 = JSON.parse(sessionStr);
        this.currentSession = session2;
        if (session2 == null ? void 0 : session2.expires_at) {
          session2.expires_at -= this.expiryMargin;
        }
        return JSON.stringify(session2);
      }
      removeItem(key2) {
        var _a;
        if (this.isInitialDelete && ((_a = this.currentSession) == null ? void 0 : _a.expires_at)) {
          const now = Math.round(Date.now() / 1e3);
          if (this.currentSession.expires_at < now + 10) {
            this.isInitialDelete = false;
            return;
          }
        }
        super.removeItem(key2);
      }
    };
  }
});

// .svelte-kit/output/server/chunks/hooks.server.js
var hooks_server_exports = {};
__export(hooks_server_exports, {
  handle: () => handle
});
var handle;
var init_hooks_server = __esm({
  ".svelte-kit/output/server/chunks/hooks.server.js"() {
    init_public();
    init_private();
    init_dist2();
    handle = async ({ event, resolve }) => {
      event.locals.supabase = createSupabaseServerClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: SUPABASE_SERVICE_KEY,
        event
      });
      console.log("running hooks");
      event.locals.getSession = async () => {
        const {
          data: { session: session2 }
        } = await event.locals.supabase.auth.getSession();
        return session2;
      };
      return resolve(event, {
        filterSerializedResponseHeaders(name) {
          return name === "content-range";
        }
      });
    };
  }
});

// .svelte-kit/output/server/chunks/index.js
function error(status, body) {
  if (isNaN(status) || status < 400 || status > 599) {
    throw new Error(`HTTP error status codes must be between 400 and 599 \u2014 ${status} is invalid`);
  }
  return new HttpError(status, body);
}
function redirect(status, location) {
  if (isNaN(status) || status < 300 || status > 308) {
    throw new Error("Invalid status code");
  }
  return new Redirect(status, location.toString());
}
function json(data, init2) {
  const body = JSON.stringify(data);
  const headers = new Headers(init2?.headers);
  if (!headers.has("content-length")) {
    headers.set("content-length", encoder2.encode(body).byteLength.toString());
  }
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return new Response(body, {
    ...init2,
    headers
  });
}
function text(body, init2) {
  const headers = new Headers(init2?.headers);
  if (!headers.has("content-length")) {
    const encoded = encoder2.encode(body);
    headers.set("content-length", encoded.byteLength.toString());
    return new Response(encoded, {
      ...init2,
      headers
    });
  }
  return new Response(body, {
    ...init2,
    headers
  });
}
var HttpError, Redirect, ActionFailure, encoder2;
var init_chunks = __esm({
  ".svelte-kit/output/server/chunks/index.js"() {
    HttpError = class {
      /**
       * @param {number} status
       * @param {{message: string} extends App.Error ? (App.Error | string | undefined) : App.Error} body
       */
      constructor(status, body) {
        this.status = status;
        if (typeof body === "string") {
          this.body = { message: body };
        } else if (body) {
          this.body = body;
        } else {
          this.body = { message: `Error: ${status}` };
        }
      }
      toString() {
        return JSON.stringify(this.body);
      }
    };
    Redirect = class {
      /**
       * @param {300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308} status
       * @param {string} location
       */
      constructor(status, location) {
        this.status = status;
        this.location = location;
      }
    };
    ActionFailure = class {
      /**
       * @param {number} status
       * @param {T} [data]
       */
      constructor(status, data) {
        this.status = status;
        this.data = data;
      }
    };
    encoder2 = new TextEncoder();
  }
});

// .svelte-kit/output/server/chunks/index2.js
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update2) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
var subscriber_queue;
var init_index2 = __esm({
  ".svelte-kit/output/server/chunks/index2.js"() {
    init_ssr();
    subscriber_queue = [];
  }
});

// node_modules/cookie/index.js
var require_cookie2 = __commonJS({
  "node_modules/cookie/index.js"(exports) {
    "use strict";
    exports.parse = parse3;
    exports.serialize = serialize2;
    var __toString = Object.prototype.toString;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse3(str, options2) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options2 || {};
      var dec = opt.decode || decode3;
      var index21 = 0;
      while (index21 < str.length) {
        var eqIdx = str.indexOf("=", index21);
        if (eqIdx === -1) {
          break;
        }
        var endIdx = str.indexOf(";", index21);
        if (endIdx === -1) {
          endIdx = str.length;
        } else if (endIdx < eqIdx) {
          index21 = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var key2 = str.slice(index21, eqIdx).trim();
        if (void 0 === obj[key2]) {
          var val = str.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key2] = tryDecode(val, dec);
        }
        index21 = endIdx + 1;
      }
      return obj;
    }
    function serialize2(name, val, options2) {
      var opt = options2 || {};
      var enc = opt.encode || encode4;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function decode3(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    function encode4(val) {
      return encodeURIComponent(val);
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]" || val instanceof Date;
    }
    function tryDecode(str, decode4) {
      try {
        return decode4(str);
      } catch (e) {
        return str;
      }
    }
  }
});

// node_modules/set-cookie-parser/lib/set-cookie.js
var require_set_cookie = __commonJS({
  "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
    "use strict";
    var defaultParseOptions = {
      decodeValues: true,
      map: false,
      silent: false
    };
    function isNonEmptyString(str) {
      return typeof str === "string" && !!str.trim();
    }
    function parseString2(setCookieValue, options2) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString);
      var nameValuePairStr = parts.shift();
      var parsed = parseNameValuePair(nameValuePairStr);
      var name = parsed.name;
      var value = parsed.value;
      options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
      try {
        value = options2.decodeValues ? decodeURIComponent(value) : value;
      } catch (e) {
        console.error(
          "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
          e
        );
      }
      var cookie = {
        name,
        value
      };
      parts.forEach(function(part) {
        var sides = part.split("=");
        var key2 = sides.shift().trimLeft().toLowerCase();
        var value2 = sides.join("=");
        if (key2 === "expires") {
          cookie.expires = new Date(value2);
        } else if (key2 === "max-age") {
          cookie.maxAge = parseInt(value2, 10);
        } else if (key2 === "secure") {
          cookie.secure = true;
        } else if (key2 === "httponly") {
          cookie.httpOnly = true;
        } else if (key2 === "samesite") {
          cookie.sameSite = value2;
        } else {
          cookie[key2] = value2;
        }
      });
      return cookie;
    }
    function parseNameValuePair(nameValuePairStr) {
      var name = "";
      var value = "";
      var nameValueArr = nameValuePairStr.split("=");
      if (nameValueArr.length > 1) {
        name = nameValueArr.shift();
        value = nameValueArr.join("=");
      } else {
        value = nameValuePairStr;
      }
      return { name, value };
    }
    function parse3(input, options2) {
      options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
      if (!input) {
        if (!options2.map) {
          return [];
        } else {
          return {};
        }
      }
      if (input.headers) {
        if (typeof input.headers.getSetCookie === "function") {
          input = input.headers.getSetCookie();
        } else if (input.headers["set-cookie"]) {
          input = input.headers["set-cookie"];
        } else {
          var sch = input.headers[Object.keys(input.headers).find(function(key2) {
            return key2.toLowerCase() === "set-cookie";
          })];
          if (!sch && input.headers.cookie && !options2.silent) {
            console.warn(
              "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
            );
          }
          input = sch;
        }
      }
      if (!Array.isArray(input)) {
        input = [input];
      }
      options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
      if (!options2.map) {
        return input.filter(isNonEmptyString).map(function(str) {
          return parseString2(str, options2);
        });
      } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
          var cookie = parseString2(str, options2);
          cookies2[cookie.name] = cookie;
          return cookies2;
        }, cookies);
      }
    }
    function splitCookiesString2(cookiesString) {
      if (Array.isArray(cookiesString)) {
        return cookiesString;
      }
      if (typeof cookiesString !== "string") {
        return [];
      }
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
      }
      return cookiesStrings;
    }
    module.exports = parse3;
    module.exports.parse = parse3;
    module.exports.parseString = parseString2;
    module.exports.splitCookiesString = splitCookiesString2;
  }
});

// .svelte-kit/output/server/entries/pages/_layout.js
var layout_exports = {};
__export(layout_exports, {
  load: () => load
});
var load;
var init_layout = __esm({
  ".svelte-kit/output/server/entries/pages/_layout.js"() {
    init_public();
    init_dist2();
    load = async ({ fetch: fetch2, data, depends }) => {
      depends("supabase:auth");
      const supabase2 = createSupabaseLoadClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch: fetch2 },
        serverSession: data.session
      });
      const {
        data: { session: session2 }
      } = await supabase2.auth.getSession();
      return { supabase: supabase2, session: session2 };
    };
  }
});

// .svelte-kit/output/server/entries/pages/_layout.server.js
var layout_server_exports = {};
__export(layout_server_exports, {
  load: () => load2
});
var load2;
var init_layout_server = __esm({
  ".svelte-kit/output/server/entries/pages/_layout.server.js"() {
    init_chunks();
    load2 = async ({ locals: { getSession } }) => {
      return {
        session: await getSession()
      };
    };
  }
});

// .svelte-kit/output/server/chunks/supabase.store.js
var supabase, session;
var init_supabase_store = __esm({
  ".svelte-kit/output/server/chunks/supabase.store.js"() {
    init_index2();
    supabase = writable(0);
    session = writable(0);
  }
});

// .svelte-kit/output/server/entries/pages/_layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => Layout
});
var css, Layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_layout.svelte.js"() {
    init_ssr();
    init_supabase_store();
    css = {
      code: '@import url("https://fonts.googleapis.com/css2?family=Fira+Code&display=swap");@font-face{font-family:"Inter New";font-weight:100 900;font-display:swap;font-style:normal;font-named-instance:"Regular";src:url("/fonts/Inter-roman.var.woff2?v=3.19") format("woff2")}:root{--font:"Inter New", "Helvetica Neue", Helvetica, Arial, sans-serif;--font-mono:"Fira Code", monospace;--bg-rgb:28, 30, 34;--bg-p:rgb(28, 30, 34);--bg-s:#282c34;--bg-alt:#23272e;--bg-blur:35, 39, 46;--bg-blur-alt:35, 39, 46;--accent:#4692d1;--accent-rgb:44, 146, 231;--accent-light:#65a2d4;--accent-lightest:#23272e;--accent-lightest-rgb:35, 39, 46;--accent-dark:#2c374d;--accent-alt:#3d83bd;--accent-table:#232a35;--url:#3792dc;--grey-lightest:#23272e;--grey-lighter:#3d4045;--grey-lighter-rgb:61, 64, 69;--grey-light:#606b7a;--grey:#808080;--grey-dark:#c9d7e0;--scrollthumb:#3b414f;--scrollthumb-hover:#2e343d;--muted:#485c6c;--red:#ff5b5b;--green:#91c17f;--orange:rgb(189, 136, 61);--orange-rgb:189, 136, 61;--editor-height:250px;--background-primary:var(--bg-p);--background-secondary:var(--bg-s);--accent:#4692d1;--accent-100:#b3f5ff;--accent-200:#98dbff;--accent-300:#7ec2ff;--accent-400:#63aaeb;--accent-500:#4692d1;--accent-600:#247bb8;--accent-700:#0065a0;--accent-800:#004f88;--accent-900:#003b71;--main:#c9d7e0;--main-alt:#dcdfed;--main-light:#979eab;--main-100:#ffffff;--main-200:#ffffff;--main-300:#fcffff;--main-400:#e2f1fa;--main-500:#c9d7e0;--main-600:#b0bec7;--main-700:#98a6ae;--main-800:#818e96;--main-900:#6a777f;--mono:#7f7f7f;--mono-900:#e0e0e0;--mono-800:#c7c7c7;--mono-700:#aeaeae;--mono-600:#969696;--mono-500:#7f7f7f;--mono-400:#686868;--mono-300:#5d5d5d;--mono-200:#3b3b3b;--mono-100:#2a2a2a;--orange:#ffa500;--orange-text:#ffa500}:root ::selection{background:var(--accent-600);color:var(--main-200)}body.light{--main:#344957;--main-alt:#fff;--main-light:#82868f;--bg-rgb:255, 255, 255;--bg-p:#fff;--bg-s:#f4f6f6;--bg-alt:#e9ecee;--bg-blur:28, 30, 34;--bg-blur-alt:235, 237, 237;--background-primary:var(--bg-p);--background-secondary:var(--bg-s);--accent:#0f6cb6;--accent-light:#65a2d4;--accent-rgb:15, 108, 182;--accent-lightest:#e9ecee;--accent-lightest-rgb:233, 236, 238;--accent-dark:#0a528c;--accent-alt:#2d8ab2;--accent-table:#0f6cb6;--url:#0f6cb6;--grey-lightest:hwb(180 92% 7%);--grey-lighter:rgb(220, 223, 228);--grey-lighter-rgb:220, 223, 228;--grey-light:#8a8d91;--grey:#808080;--grey-dark:#303133;--scrollthumb:#cdcdcd;--scrollthumb-hover:#aeaeae;--muted:#c9d2da;--red:#e9686a;--green:#38ae48;--orange:rgb(255, 165, 0);--orange-text:rgb(232, 158, 21);--mono:#7f7f7f;--mono-100:#e0e0e0;--mono-200:#c7c7c7;--mono-300:#aeaeae;--mono-400:#969696;--mono-500:#7f7f7f;--mono-600:#686868;--mono-700:#535353;--mono-800:#3e3e3e;--mono-900:#2a2a2a}body.light ::selection{background:#63aaeb}html{scrollbar-gutter:stable}body{margin:0;padding:0;color:var(--main);background-color:var(--bg-p);font-family:var(--font);font-feature-settings:"case" !important}body.light mark{background-color:rgba(var(--accent-rgb), 0.25);color:var(--main)}body.light pre.json{background-color:#fdf6e3;text-shadow:#eee8d5 0 1px}body.light pre.json .json-key{color:#2aa198}body.light pre.json .json-value{font-weight:400;color:#d33682}body.light pre.json .json-string{color:#979900}pre.json{font-family:"Fira Code", monospace;background-color:#282a36}pre.json .json-key{color:#ff79c6}pre.json .json-value{font-weight:400;color:#bd93f9}pre.json .json-string{color:#f1fa8c}.hide{display:none !important}*{box-sizing:border-box}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{border-radius:100px}::-webkit-scrollbar-thumb{border-radius:10px;background:var(--scrollthumb)}::-webkit-scrollbar-thumb:hover{background:var(--scrollthumb-hover)}::-webkit-scrollbar-corner{background-color:transparent}a.btn,a.button,button{height:100%;text-decoration:none;padding:0.5rem 1rem;font-weight:500;font-size:1rem;font-family:inherit;border-radius:0.5rem;outline:none;border:1px solid var(--accent);color:var(--accent);background-color:var(--bg-p);cursor:pointer;display:flex;display:inline-flex;justify-content:center;align-items:center;box-sizing:border-box}a.btn:hover,a.button:hover,button:hover{box-shadow:inset 0 0 100px 100px rgba(var(--accent-rgb), 0.12);text-decoration:none !important}a.btn:not(.nofocus):focus,a.button:not(.nofocus):focus,button:not(.nofocus):focus{text-decoration:none !important}a.btn:focus-visible,a.button:focus-visible,button:focus-visible{outline:2px solid var(--mono-200) !important}a.btn:disabled,a.button:disabled,button:disabled{background-color:var(--mono-200);border:1px solid var(--grey-light);color:var(--grey);pointer-events:none}a.btn:disabled img,a.button:disabled img,button:disabled img{filter:brightness(0) saturate(100%) invert(99%) sepia(0%) saturate(74%) hue-rotate(179deg) brightness(82%) contrast(89%)}a.btn.alt,a.button.alt,button.alt{background-color:var(--accent);border:1px solid transparent;color:var(--main-alt);transition:outline 0.15s}a.btn.alt:hover,a.button.alt:hover,button.alt:hover{box-shadow:inset 0 0 100px 100px rgba(0, 0, 0, 0.12)}a.btn.alt:not(.nofocus):focus,a.button.alt:not(.nofocus):focus,button.alt:not(.nofocus):focus{box-shadow:inset 0 0 100px 100px rgba(0, 0, 0, 0.12)}a.btn.alt:focus-visible,a.button.alt:focus-visible,button.alt:focus-visible{outline:4px solid var(--accent-200) !important}a.btn.fit,a.button.fit,button.fit{height:fit-content;width:fit-content}a.btn.warning,a.button.warning,button.warning{background-color:#e9686a;color:var(--bg-p);border:1px solid transparent}a.btn.warning img,a.button.warning img,button.warning img{filter:brightness(0) saturate(100%) invert(98%) sepia(100%) saturate(6946%) hue-rotate(184deg) brightness(131%) contrast(100%)}a.btn.icon,a.button.icon,button.icon{display:flex;justify-content:center;align-items:center}a.btn.plain,a.button.plain,button.plain{background-color:transparent;border:none;outline:none;color:var(--main)}a.btn.plain:hover,a.btn.plain:focus,a.button.plain:hover,a.button.plain:focus,button.plain:hover,button.plain:focus{box-shadow:none}a.btn.none,a.button.none,button.none{background-color:transparent;border:none;outline:none;color:inherit;width:fit-content;height:fit-content;padding:0.25rem;border-radius:0.25rem;font-weight:inherit}a.btn.none:hover,a.button.none:hover,button.none:hover{box-shadow:none;background-color:color-mix(in srgb, var(--mono-600) 10%, transparent)}a.btn.none.noHover,a.button.none.noHover,button.none.noHover{background-color:transparent}a.btn.none:focus,a.button.none:focus,button.none:focus{box-shadow:none}a.btn.link,a.button.link,button.link{background-color:transparent;border:none;outline:none;color:var(--accent);width:fit-content;height:fit-content;padding:0;font-weight:inherit}a.btn.link:hover,a.btn.link:focus,a.button.link:hover,a.button.link:focus,button.link:hover,button.link:focus{box-shadow:none}a.btn.link:hover,a.button.link:hover,button.link:hover{text-decoration:underline !important}a.btn[disabled],a.button[disabled],button[disabled]{user-select:none;pointer-events:none}a.btn.slim,a.button.slim,button.slim{font-size:0.875rem;padding-inline:1.5rem}a{color:var(--url)}a[disabled]{color:var(--main-light);pointer-events:none;user-select:none}.buttonRows{display:flex;flex-direction:row-reverse;gap:0.5rem}.buttonRows button{min-width:80px}input,textarea{font-family:inherit;font-size:inherit;outline:none;border:1px solid var(--mono-200);background-color:var(--bg-p);padding:0.5rem;border-radius:0.25rem;resize:vertical;max-height:1000px;color:var(--main);font-feature-settings:"case" !important}input.placeholder-smaller::placeholder,textarea.placeholder-smaller::placeholder{font-size:0.875rem}input::placeholder,textarea::placeholder{color:var(--mono-400)}input:focus,textarea:focus{border:1px solid transparent;outline:1px solid var(--accent)}input:disabled,textarea:disabled{background-color:var(--mono-200)}input.error,textarea.error{border:none;outline-color:#e9686a !important}textarea{min-height:100px}.icon{display:flex;justify-content:center;align-items:center}.inputBox{font-family:inherit;font-size:inherit;outline:none;border:1px solid var(--mono-200);background-color:var(--bg-p);padding-inline:0.5rem;border-radius:0.25rem;resize:vertical;color:var(--main);display:flex;align-items:center;gap:0.25rem}.inputBox .icon{display:flex;justify-content:center;align-items:center;color:var(--mono-300)}.inputBox:focus-within{border:1px solid transparent;outline:1px solid var(--accent)}.inputBox .prefix{color:var(--grey-light)}.inputBox input{padding-left:0;border:0;background-color:transparent}.inputBox input:focus{border:0;outline:0}.inputBox[disabled=true]{background-color:var(--mono-200) !important}pre{background-color:var(--mono-200);border-radius:0.5rem;white-space:break-spaces;font-family:inherit;font-size:inherit;padding:1rem;margin:0}code{background-color:var(--muted);padding:2px;padding-inline:6px;border-radius:4px;font-family:"Fira Code", monospace}span.small{font-size:12px}.kbs{margin-left:auto;display:flex;gap:0.25rem}.kbs code{user-select:none;font-size:0.75rem;background-color:var(--muted);opacity:0.5}table{width:100%;table-layout:auto;border-collapse:separate;background-color:var(--bg-p);border-spacing:0;color:var(--main);--table__border-color:var(--mono-100);--table__background-color:#f4f6f6}table.light{--table__background-color:#f4f6f6;--table__border-color:var(--mono-100)}table.dark{--table__background-color:#292e35;--table__border-color:var(--mono-200)}table tbody tr:hover td{background-color:color-mix(in srgb, var(--accent) 12%, transparent)}table.noHover tbody tr:hover td{background-color:transparent !important}table th,table td{border-right:1px solid var(--table__border-color);border-radius:none}table th>div,table td>div{padding-block:0.5rem;padding-inline:0.5rem;display:flex}table th{border-top:1px solid var(--table__border-color);border-bottom:1px solid var(--table__border-color);font-size:14px;font-weight:400;background-color:var(--table__background-color);font-weight:500}table th:first-child{border-radius:0.25rem 0 0 0;border-left:1px solid var(--table__border-color)}table th:last-child{border-radius:0 0.25rem 0 0}table th:nth-last-child(2){border-right:0}table th:last-child{border-left:0}table tbody tr:last-child td:first-child{border-radius:0 0 0 0.25rem}table tbody tr:last-child td:last-child{border-radius:0 0 0.25rem 0rem}table td{border-bottom:1px solid var(--table__border-color)}table td:first-child{border-left:1px solid var(--table__border-color)}table td>div{padding-block:0.325rem;width:fit-content;white-space:break-spaces;gap:2px;flex-wrap:wrap;width:100%}table td>div.center{justify-content:center}table td>div.actions{width:120px;display:flex;gap:0.25rem;justify-content:flex-end}table td>div.actions button:hover{color:var(--accent-500)}table td>div.actions button:hover.delete{color:#e9686a}table td:nth-last-child(2){border-right:0}table td:last-child{border-left:0}table.noInnerBorder th:not(:last-child),table.noInnerBorder td:not(:last-child){border-right:0}table.noActionColumn th:nth-last-child(2){border-right:1px solid var(--table__border-color)}table.noActionColumn th:last-child{border-left:0}table.noActionColumn td:nth-last-child(2){border-right:1px solid var(--table__border-color)}table.noActionColumn td:last-child{border-left:0}table.horizontal{border-collapse:collapse}table.horizontal tr th{border-radius:0;text-align:left;padding:0.5rem 0.5rem;font-size:0.875rem}table.horizontal tr td{border:1px solid var(--mono-100);text-align:left;padding:0.5rem 0.5rem;font-size:0.875rem}.table_wrapper{margin-top:1rem;overflow-y:hidden;overflow-x:auto}@media screen and (max-width: 600px){.table_wrapper{width:calc(100vw - 4rem)}}.csd-tt__popup{box-shadow:none !important}.csd-tt__popup .csd-tt__popup__label{padding-right:2rem !important}',
      map: null
    };
    Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $session, $$unsubscribe_session;
      let $supabase, $$unsubscribe_supabase;
      $$unsubscribe_session = subscribe(session, (value) => $session = value);
      $$unsubscribe_supabase = subscribe(supabase, (value) => $supabase = value);
      let { data } = $$props;
      set_store_value(supabase, $supabase = data.supabase, $supabase);
      set_store_value(session, $session = data.session, $session);
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css);
      set_store_value(supabase, $supabase = data.supabase, $supabase);
      $$unsubscribe_session();
      $$unsubscribe_supabase();
      return `${slots.default ? slots.default({}) : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  component: () => component,
  fonts: () => fonts,
  imports: () => imports,
  index: () => index,
  server: () => layout_server_exports,
  server_id: () => server_id,
  stylesheets: () => stylesheets,
  universal: () => layout_exports,
  universal_id: () => universal_id
});
var index, component_cache, component, universal_id, server_id, imports, stylesheets, fonts;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    init_layout();
    init_layout_server();
    index = 0;
    component = async () => component_cache ?? (component_cache = (await Promise.resolve().then(() => (init_layout_svelte(), layout_svelte_exports))).default);
    universal_id = "src/routes/+layout.js";
    server_id = "src/routes/+layout.server.js";
    imports = ["_app/immutable/nodes/0.6952b6c5.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/preload-helper.a4192956.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/supabase.store.eea9b4ba.js", "_app/immutable/chunks/index.a6216602.js"];
    stylesheets = ["_app/immutable/assets/0.dc0482d1.css"];
    fonts = [];
  }
});

// .svelte-kit/output/server/chunks/stores.js
var getStores, page, navigating;
var init_stores = __esm({
  ".svelte-kit/output/server/chunks/stores.js"() {
    init_ssr();
    getStores = () => {
      const stores = getContext("__svelte__");
      return {
        /** @type {typeof page} */
        page: {
          subscribe: stores.page.subscribe
        },
        /** @type {typeof navigating} */
        navigating: {
          subscribe: stores.navigating.subscribe
        },
        /** @type {typeof updated} */
        updated: stores.updated
      };
    };
    page = {
      subscribe(fn) {
        const store = getStores().page;
        return store.subscribe(fn);
      }
    };
    navigating = {
      subscribe(fn) {
        const store = getStores().navigating;
        return store.subscribe(fn);
      }
    };
  }
});

// .svelte-kit/output/server/chunks/functions.js
function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) {
    result.hFlip = true;
  }
  if (!obj1.vFlip !== !obj2.vFlip) {
    result.vFlip = true;
  }
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) {
    result.rotate = rotate;
  }
  return result;
}
function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key2 in defaultExtendedIconProps) {
    if (key2 in defaultIconTransformations) {
      if (key2 in parent && !(key2 in result)) {
        result[key2] = defaultIconTransformations[key2];
      }
    } else if (key2 in child) {
      result[key2] = child[key2];
    } else if (key2 in parent) {
      result[key2] = parent[key2];
    }
  }
  return result;
}
function getIconsTree(data, names) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve(name) {
    if (icons[name]) {
      return resolved[name] = [];
    }
    if (!(name in resolved)) {
      resolved[name] = null;
      const parent = aliases[name] && aliases[name].parent;
      const value = parent && resolve(parent);
      if (value) {
        resolved[name] = [parent].concat(value);
      }
    }
    return resolved[name];
  }
  (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
  return resolved;
}
function internalGetIconData(data, name, tree) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse3(name2) {
    currentProps = mergeIconData(
      icons[name2] || aliases[name2],
      currentProps
    );
  }
  parse3(name);
  tree.forEach(parse3);
  return mergeIconData(data, currentProps);
}
function parseIconSet(data, callback) {
  const names = [];
  if (typeof data !== "object" || typeof data.icons !== "object") {
    return names;
  }
  if (data.not_found instanceof Array) {
    data.not_found.forEach((name) => {
      callback(name, null);
      names.push(name);
    });
  }
  const tree = getIconsTree(data);
  for (const name in tree) {
    const item = tree[name];
    if (item) {
      callback(name, internalGetIconData(data, name, item));
      names.push(name);
    }
  }
  return names;
}
function checkOptionalProps(item, defaults) {
  for (const prop in defaults) {
    if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
      return false;
    }
  }
  return true;
}
function quicklyValidateIconSet(obj) {
  if (typeof obj !== "object" || obj === null) {
    return null;
  }
  const data = obj;
  if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
    return null;
  }
  if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
    return null;
  }
  const icons = data.icons;
  for (const name in icons) {
    const icon = icons[name];
    if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  for (const name in aliases) {
    const icon = aliases[name];
    const parent = icon.parent;
    if (!name.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  return data;
}
function newStorage(provider, prefix2) {
  return {
    provider,
    prefix: prefix2,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ new Set()
  };
}
function getStorage(provider, prefix2) {
  const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
  return providerStorage[prefix2] || (providerStorage[prefix2] = newStorage(provider, prefix2));
}
function addIconSet(storage2, data) {
  if (!quicklyValidateIconSet(data)) {
    return [];
  }
  return parseIconSet(data, (name, icon) => {
    if (icon) {
      storage2.icons[name] = icon;
    } else {
      storage2.missing.add(name);
    }
  });
}
function addIconToStorage(storage2, name, icon) {
  try {
    if (typeof icon.body === "string") {
      storage2.icons[name] = { ...icon };
      return true;
    }
  } catch (err) {
  }
  return false;
}
function allowSimpleNames(allow) {
  if (typeof allow === "boolean") {
    simpleNames = allow;
  }
  return simpleNames;
}
function getIconData(name) {
  const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
  if (icon) {
    const storage2 = getStorage(icon.provider, icon.prefix);
    const iconName = icon.name;
    return storage2.icons[iconName] || (storage2.missing.has(iconName) ? null : void 0);
  }
}
function addIcon(name, data) {
  const icon = stringToIcon(name, true, simpleNames);
  if (!icon) {
    return false;
  }
  const storage2 = getStorage(icon.provider, icon.prefix);
  return addIconToStorage(storage2, icon.name, data);
}
function addCollection(data, provider) {
  if (typeof data !== "object") {
    return false;
  }
  if (typeof provider !== "string") {
    provider = data.provider || "";
  }
  if (simpleNames && !provider && !data.prefix) {
    let added = false;
    if (quicklyValidateIconSet(data)) {
      data.prefix = "";
      parseIconSet(data, (name, icon) => {
        if (icon && addIcon(name, icon)) {
          added = true;
        }
      });
    }
    return added;
  }
  const prefix2 = data.prefix;
  if (!validateIconName({
    provider,
    prefix: prefix2,
    name: "a"
  })) {
    return false;
  }
  const storage2 = getStorage(provider, prefix2);
  return !!addIconSet(storage2, data);
}
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width;
  let height;
  if (customisationsWidth === null) {
    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width = calculateSize(height, boxWidth / boxHeight);
  } else {
    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = (prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  };
  setAttr("width", width);
  setAttr("height", height);
  attributes.viewBox = box.left.toString() + " " + box.top.toString() + " " + boxWidth.toString() + " " + boxHeight.toString();
  return {
    attributes,
    body
  };
}
function replaceIDs(body, prefix2 = randomPrefix) {
  const ids = [];
  let match;
  while (match = regex.exec(body)) {
    ids.push(match[1]);
  }
  if (!ids.length) {
    return body;
  }
  const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  ids.forEach((id) => {
    const newID = typeof prefix2 === "function" ? prefix2(id) : prefix2 + (counter++).toString();
    const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(
      // Allowed characters before id: [#;"]
      // Allowed characters after id: [)"], .[a-z]
      new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
      "$1" + newID + suffix + "$3"
    );
  });
  body = body.replace(new RegExp(suffix, "g"), "");
  return body;
}
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function getAPIModule(provider) {
  return storage[provider] || storage[""];
}
function createAPIConfig(source) {
  let resources;
  if (typeof source.resources === "string") {
    resources = [source.resources];
  } else {
    resources = source.resources;
    if (!(resources instanceof Array) || !resources.length) {
      return null;
    }
  }
  const result = {
    // API hosts
    resources,
    // Root path
    path: source.path || "/",
    // URL length limit
    maxURL: source.maxURL || 500,
    // Timeout before next host is used.
    rotate: source.rotate || 750,
    // Timeout before failing query.
    timeout: source.timeout || 5e3,
    // Randomise default API end point.
    random: source.random === true,
    // Start index
    index: source.index || 0,
    // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
    dataAfterTimeout: source.dataAfterTimeout !== false
  };
  return result;
}
function addAPIProvider(provider, customConfig) {
  const config = createAPIConfig(customConfig);
  if (config === null) {
    return false;
  }
  configStorage[provider] = config;
  return true;
}
function getAPIConfig(provider) {
  return configStorage[provider];
}
function calculateMaxLength(provider, prefix2) {
  const config = getAPIConfig(provider);
  if (!config) {
    return 0;
  }
  let result;
  if (!config.maxURL) {
    result = 0;
  } else {
    let maxHostLength = 0;
    config.resources.forEach((item) => {
      const host = item;
      maxHostLength = Math.max(maxHostLength, host.length);
    });
    const url = prefix2 + ".json?icons=";
    result = config.maxURL - maxHostLength - config.path.length - url.length;
  }
  return result;
}
function shouldAbort(status) {
  return status === 404;
}
function getPath(provider) {
  if (typeof provider === "string") {
    const config = getAPIConfig(provider);
    if (config) {
      return config.path;
    }
  }
  return "/";
}
function sortIcons(icons) {
  const result = {
    loaded: [],
    missing: [],
    pending: []
  };
  const storage2 = /* @__PURE__ */ Object.create(null);
  icons.sort((a, b) => {
    if (a.provider !== b.provider) {
      return a.provider.localeCompare(b.provider);
    }
    if (a.prefix !== b.prefix) {
      return a.prefix.localeCompare(b.prefix);
    }
    return a.name.localeCompare(b.name);
  });
  let lastIcon = {
    provider: "",
    prefix: "",
    name: ""
  };
  icons.forEach((icon) => {
    if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
      return;
    }
    lastIcon = icon;
    const provider = icon.provider;
    const prefix2 = icon.prefix;
    const name = icon.name;
    const providerStorage = storage2[provider] || (storage2[provider] = /* @__PURE__ */ Object.create(null));
    const localStorage2 = providerStorage[prefix2] || (providerStorage[prefix2] = getStorage(provider, prefix2));
    let list;
    if (name in localStorage2.icons) {
      list = result.loaded;
    } else if (prefix2 === "" || localStorage2.missing.has(name)) {
      list = result.missing;
    } else {
      list = result.pending;
    }
    const item = {
      provider,
      prefix: prefix2,
      name
    };
    list.push(item);
  });
  return result;
}
function removeCallback(storages, id) {
  storages.forEach((storage2) => {
    const items = storage2.loaderCallbacks;
    if (items) {
      storage2.loaderCallbacks = items.filter((row) => row.id !== id);
    }
  });
}
function updateCallbacks(storage2) {
  if (!storage2.pendingCallbacksFlag) {
    storage2.pendingCallbacksFlag = true;
    setTimeout(() => {
      storage2.pendingCallbacksFlag = false;
      const items = storage2.loaderCallbacks ? storage2.loaderCallbacks.slice(0) : [];
      if (!items.length) {
        return;
      }
      let hasPending = false;
      const provider = storage2.provider;
      const prefix2 = storage2.prefix;
      items.forEach((item) => {
        const icons = item.icons;
        const oldLength = icons.pending.length;
        icons.pending = icons.pending.filter((icon) => {
          if (icon.prefix !== prefix2) {
            return true;
          }
          const name = icon.name;
          if (storage2.icons[name]) {
            icons.loaded.push({
              provider,
              prefix: prefix2,
              name
            });
          } else if (storage2.missing.has(name)) {
            icons.missing.push({
              provider,
              prefix: prefix2,
              name
            });
          } else {
            hasPending = true;
            return true;
          }
          return false;
        });
        if (icons.pending.length !== oldLength) {
          if (!hasPending) {
            removeCallback([storage2], item.id);
          }
          item.callback(
            icons.loaded.slice(0),
            icons.missing.slice(0),
            icons.pending.slice(0),
            item.abort
          );
        }
      });
    });
  }
}
function storeCallback(callback, icons, pendingSources) {
  const id = idCounter++;
  const abort = removeCallback.bind(null, pendingSources, id);
  if (!icons.pending.length) {
    return abort;
  }
  const item = {
    id,
    icons,
    callback,
    abort
  };
  pendingSources.forEach((storage2) => {
    (storage2.loaderCallbacks || (storage2.loaderCallbacks = [])).push(item);
  });
  return abort;
}
function listToIcons(list, validate = true, simpleNames2 = false) {
  const result = [];
  list.forEach((item) => {
    const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames2) : item;
    if (icon) {
      result.push(icon);
    }
  });
  return result;
}
function sendQuery(config, payload, query, done) {
  const resourcesCount = config.resources.length;
  const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
  let resources;
  if (config.random) {
    let list = config.resources.slice(0);
    resources = [];
    while (list.length > 1) {
      const nextIndex = Math.floor(Math.random() * list.length);
      resources.push(list[nextIndex]);
      list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
    }
    resources = resources.concat(list);
  } else {
    resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
  }
  const startTime = Date.now();
  let status = "pending";
  let queriesSent = 0;
  let lastError;
  let timer = null;
  let queue = [];
  let doneCallbacks = [];
  if (typeof done === "function") {
    doneCallbacks.push(done);
  }
  function resetTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function abort() {
    if (status === "pending") {
      status = "aborted";
    }
    resetTimer();
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function subscribe2(callback, overwrite) {
    if (overwrite) {
      doneCallbacks = [];
    }
    if (typeof callback === "function") {
      doneCallbacks.push(callback);
    }
  }
  function getQueryStatus() {
    return {
      startTime,
      payload,
      status,
      queriesSent,
      queriesPending: queue.length,
      subscribe: subscribe2,
      abort
    };
  }
  function failQuery() {
    status = "failed";
    doneCallbacks.forEach((callback) => {
      callback(void 0, lastError);
    });
  }
  function clearQueue() {
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function moduleResponse(item, response, data) {
    const isError = response !== "success";
    queue = queue.filter((queued) => queued !== item);
    switch (status) {
      case "pending":
        break;
      case "failed":
        if (isError || !config.dataAfterTimeout) {
          return;
        }
        break;
      default:
        return;
    }
    if (response === "abort") {
      lastError = data;
      failQuery();
      return;
    }
    if (isError) {
      lastError = data;
      if (!queue.length) {
        if (!resources.length) {
          failQuery();
        } else {
          execNext();
        }
      }
      return;
    }
    resetTimer();
    clearQueue();
    if (!config.random) {
      const index21 = config.resources.indexOf(item.resource);
      if (index21 !== -1 && index21 !== config.index) {
        config.index = index21;
      }
    }
    status = "completed";
    doneCallbacks.forEach((callback) => {
      callback(data);
    });
  }
  function execNext() {
    if (status !== "pending") {
      return;
    }
    resetTimer();
    const resource = resources.shift();
    if (resource === void 0) {
      if (queue.length) {
        timer = setTimeout(() => {
          resetTimer();
          if (status === "pending") {
            clearQueue();
            failQuery();
          }
        }, config.timeout);
        return;
      }
      failQuery();
      return;
    }
    const item = {
      status: "pending",
      resource,
      callback: (status2, data) => {
        moduleResponse(item, status2, data);
      }
    };
    queue.push(item);
    queriesSent++;
    timer = setTimeout(execNext, config.rotate);
    query(resource, payload, item.callback);
  }
  setTimeout(execNext);
  return getQueryStatus;
}
function initRedundancy(cfg) {
  const config = {
    ...defaultConfig,
    ...cfg
  };
  let queries = [];
  function cleanup() {
    queries = queries.filter((item) => item().status === "pending");
  }
  function query(payload, queryCallback, doneCallback) {
    const query2 = sendQuery(
      config,
      payload,
      queryCallback,
      (data, error2) => {
        cleanup();
        if (doneCallback) {
          doneCallback(data, error2);
        }
      }
    );
    queries.push(query2);
    return query2;
  }
  function find(callback) {
    return queries.find((value) => {
      return callback(value);
    }) || null;
  }
  const instance = {
    query,
    find,
    setIndex: (index21) => {
      config.index = index21;
    },
    getIndex: () => config.index,
    cleanup
  };
  return instance;
}
function emptyCallback$1() {
}
function getRedundancyCache(provider) {
  if (!redundancyCache[provider]) {
    const config = getAPIConfig(provider);
    if (!config) {
      return;
    }
    const redundancy = initRedundancy(config);
    const cachedReundancy = {
      config,
      redundancy
    };
    redundancyCache[provider] = cachedReundancy;
  }
  return redundancyCache[provider];
}
function sendAPIQuery(target, query, callback) {
  let redundancy;
  let send2;
  if (typeof target === "string") {
    const api = getAPIModule(target);
    if (!api) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    send2 = api.send;
    const cached = getRedundancyCache(target);
    if (cached) {
      redundancy = cached.redundancy;
    }
  } else {
    const config = createAPIConfig(target);
    if (config) {
      redundancy = initRedundancy(config);
      const moduleKey = target.resources ? target.resources[0] : "";
      const api = getAPIModule(moduleKey);
      if (api) {
        send2 = api.send;
      }
    }
  }
  if (!redundancy || !send2) {
    callback(void 0, 424);
    return emptyCallback$1;
  }
  return redundancy.query(query, send2, callback)().abort;
}
function getStoredItem(func, key2) {
  try {
    return func.getItem(key2);
  } catch (err) {
  }
}
function setStoredItem(func, key2, value) {
  try {
    func.setItem(key2, value);
    return true;
  } catch (err) {
  }
}
function removeStoredItem(func, key2) {
  try {
    func.removeItem(key2);
  } catch (err) {
  }
}
function setBrowserStorageItemsCount(storage2, value) {
  return setStoredItem(storage2, browserCacheCountKey, value.toString());
}
function getBrowserStorageItemsCount(storage2) {
  return parseInt(getStoredItem(storage2, browserCacheCountKey)) || 0;
}
function setBrowserStorageStatus(status) {
  browserStorageStatus = status;
}
function getBrowserStorage(key2) {
  const attr = key2 + "Storage";
  try {
    if (_window && _window[attr] && typeof _window[attr].length === "number") {
      return _window[attr];
    }
  } catch (err) {
  }
  browserStorageConfig[key2] = false;
}
function iterateBrowserStorage(key2, callback) {
  const func = getBrowserStorage(key2);
  if (!func) {
    return;
  }
  const version6 = getStoredItem(func, browserCacheVersionKey);
  if (version6 !== browserCacheVersion) {
    if (version6) {
      const total2 = getBrowserStorageItemsCount(func);
      for (let i = 0; i < total2; i++) {
        removeStoredItem(func, browserCachePrefix + i.toString());
      }
    }
    setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
    setBrowserStorageItemsCount(func, 0);
    return;
  }
  const minTime = Math.floor(Date.now() / browserStorageHour) - browserStorageCacheExpiration;
  const parseItem = (index21) => {
    const name = browserCachePrefix + index21.toString();
    const item = getStoredItem(func, name);
    if (typeof item !== "string") {
      return;
    }
    try {
      const data = JSON.parse(item);
      if (typeof data === "object" && typeof data.cached === "number" && data.cached > minTime && typeof data.provider === "string" && typeof data.data === "object" && typeof data.data.prefix === "string" && // Valid item: run callback
      callback(data, index21)) {
        return true;
      }
    } catch (err) {
    }
    removeStoredItem(func, name);
  };
  let total = getBrowserStorageItemsCount(func);
  for (let i = total - 1; i >= 0; i--) {
    if (!parseItem(i)) {
      if (i === total - 1) {
        total--;
        setBrowserStorageItemsCount(func, total);
      } else {
        browserStorageEmptyItems[key2].add(i);
      }
    }
  }
}
function initBrowserStorage() {
  if (browserStorageStatus) {
    return;
  }
  setBrowserStorageStatus(true);
  for (const key2 in browserStorageConfig) {
    iterateBrowserStorage(key2, (item) => {
      const iconSet = item.data;
      const provider = item.provider;
      const prefix2 = iconSet.prefix;
      const storage2 = getStorage(
        provider,
        prefix2
      );
      if (!addIconSet(storage2, iconSet).length) {
        return false;
      }
      const lastModified = iconSet.lastModified || -1;
      storage2.lastModifiedCached = storage2.lastModifiedCached ? Math.min(storage2.lastModifiedCached, lastModified) : lastModified;
      return true;
    });
  }
}
function updateLastModified(storage2, lastModified) {
  const lastValue = storage2.lastModifiedCached;
  if (
    // Matches or newer
    lastValue && lastValue >= lastModified
  ) {
    return lastValue === lastModified;
  }
  storage2.lastModifiedCached = lastModified;
  if (lastValue) {
    for (const key2 in browserStorageConfig) {
      iterateBrowserStorage(key2, (item) => {
        const iconSet = item.data;
        return item.provider !== storage2.provider || iconSet.prefix !== storage2.prefix || iconSet.lastModified === lastModified;
      });
    }
  }
  return true;
}
function storeInBrowserStorage(storage2, data) {
  if (!browserStorageStatus) {
    initBrowserStorage();
  }
  function store(key2) {
    let func;
    if (!browserStorageConfig[key2] || !(func = getBrowserStorage(key2))) {
      return;
    }
    const set = browserStorageEmptyItems[key2];
    let index21;
    if (set.size) {
      set.delete(index21 = Array.from(set).shift());
    } else {
      index21 = getBrowserStorageItemsCount(func);
      if (!setBrowserStorageItemsCount(func, index21 + 1)) {
        return;
      }
    }
    const item = {
      cached: Math.floor(Date.now() / browserStorageHour),
      provider: storage2.provider,
      data
    };
    return setStoredItem(
      func,
      browserCachePrefix + index21.toString(),
      JSON.stringify(item)
    );
  }
  if (data.lastModified && !updateLastModified(storage2, data.lastModified)) {
    return;
  }
  if (!Object.keys(data.icons).length) {
    return;
  }
  if (data.not_found) {
    data = Object.assign({}, data);
    delete data.not_found;
  }
  if (!store("local")) {
    store("session");
  }
}
function emptyCallback() {
}
function loadedNewIcons(storage2) {
  if (!storage2.iconsLoaderFlag) {
    storage2.iconsLoaderFlag = true;
    setTimeout(() => {
      storage2.iconsLoaderFlag = false;
      updateCallbacks(storage2);
    });
  }
}
function loadNewIcons(storage2, icons) {
  if (!storage2.iconsToLoad) {
    storage2.iconsToLoad = icons;
  } else {
    storage2.iconsToLoad = storage2.iconsToLoad.concat(icons).sort();
  }
  if (!storage2.iconsQueueFlag) {
    storage2.iconsQueueFlag = true;
    setTimeout(() => {
      storage2.iconsQueueFlag = false;
      const { provider, prefix: prefix2 } = storage2;
      const icons2 = storage2.iconsToLoad;
      delete storage2.iconsToLoad;
      let api;
      if (!icons2 || !(api = getAPIModule(provider))) {
        return;
      }
      const params = api.prepare(provider, prefix2, icons2);
      params.forEach((item) => {
        sendAPIQuery(provider, item, (data) => {
          if (typeof data !== "object") {
            item.icons.forEach((name) => {
              storage2.missing.add(name);
            });
          } else {
            try {
              const parsed = addIconSet(
                storage2,
                data
              );
              if (!parsed.length) {
                return;
              }
              const pending = storage2.pendingIcons;
              if (pending) {
                parsed.forEach((name) => {
                  pending.delete(name);
                });
              }
              storeInBrowserStorage(storage2, data);
            } catch (err) {
              console.error(err);
            }
          }
          loadedNewIcons(storage2);
        });
      });
    });
  }
}
function mergeCustomisations(defaults, item) {
  const result = {
    ...defaults
  };
  for (const key2 in item) {
    const value = item[key2];
    const valueType = typeof value;
    if (key2 in defaultIconSizeCustomisations) {
      if (value === null || value && (valueType === "string" || valueType === "number")) {
        result[key2] = value;
      }
    } else if (valueType === typeof result[key2]) {
      result[key2] = key2 === "rotate" ? value % 4 : value;
    }
  }
  return result;
}
function flipFromString(custom, flip) {
  flip.split(separator).forEach((str) => {
    const value = str.trim();
    switch (value) {
      case "horizontal":
        custom.hFlip = true;
        break;
      case "vertical":
        custom.vFlip = true;
        break;
    }
  });
}
function rotateFromString(value, defaultValue = 0) {
  const units = value.replace(/^-?[0-9.]*/, "");
  function cleanup(value2) {
    while (value2 < 0) {
      value2 += 4;
    }
    return value2 % 4;
  }
  if (units === "") {
    const num = parseInt(value);
    return isNaN(num) ? 0 : cleanup(num);
  } else if (units !== value) {
    let split = 0;
    switch (units) {
      case "%":
        split = 25;
        break;
      case "deg":
        split = 90;
    }
    if (split) {
      let num = parseFloat(value.slice(0, value.length - units.length));
      if (isNaN(num)) {
        return 0;
      }
      num = num / split;
      return num % 1 === 0 ? cleanup(num) : 0;
    }
  }
  return defaultValue;
}
function iconToHTML(body, attributes) {
  let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const attr in attributes) {
    renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
}
function encodeSVGforURL(svg) {
  return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
function svgToData(svg) {
  return "data:image/svg+xml," + encodeSVGforURL(svg);
}
function svgToURL(svg) {
  return 'url("' + svgToData(svg) + '")';
}
function fixSize(value) {
  return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
}
function render(icon, props) {
  const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
  const mode = props.mode || "svg";
  const componentProps = mode === "svg" ? { ...svgDefaults } : {};
  if (icon.body.indexOf("xlink:") === -1) {
    delete componentProps["xmlns:xlink"];
  }
  let style = typeof props.style === "string" ? props.style : "";
  for (let key2 in props) {
    const value = props[key2];
    if (value === void 0) {
      continue;
    }
    switch (key2) {
      case "icon":
      case "style":
      case "onLoad":
      case "mode":
        break;
      case "inline":
      case "hFlip":
      case "vFlip":
        customisations[key2] = value === true || value === "true" || value === 1;
        break;
      case "flip":
        if (typeof value === "string") {
          flipFromString(customisations, value);
        }
        break;
      case "color":
        style = style + (style.length > 0 && style.trim().slice(-1) !== ";" ? ";" : "") + "color: " + value + "; ";
        break;
      case "rotate":
        if (typeof value === "string") {
          customisations[key2] = rotateFromString(value);
        } else if (typeof value === "number") {
          customisations[key2] = value;
        }
        break;
      case "ariaHidden":
      case "aria-hidden":
        if (value !== true && value !== "true") {
          delete componentProps["aria-hidden"];
        }
        break;
      default:
        if (key2.slice(0, 3) === "on:") {
          break;
        }
        if (defaultExtendedIconCustomisations[key2] === void 0) {
          componentProps[key2] = value;
        }
    }
  }
  const item = iconToSVG(icon, customisations);
  const renderAttribs = item.attributes;
  if (customisations.inline) {
    style = "vertical-align: -0.125em; " + style;
  }
  if (mode === "svg") {
    Object.assign(componentProps, renderAttribs);
    if (style !== "") {
      componentProps.style = style;
    }
    let localCounter = 0;
    let id = props.id;
    if (typeof id === "string") {
      id = id.replace(/-/g, "_");
    }
    return {
      svg: true,
      attributes: componentProps,
      body: replaceIDs(item.body, id ? () => id + "ID" + localCounter++ : "iconifySvelte")
    };
  }
  const { body, width, height } = icon;
  const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
  const html = iconToHTML(body, {
    ...renderAttribs,
    width: width + "",
    height: height + ""
  });
  const url = svgToURL(html);
  const styles = {
    "--svg": url
  };
  const size = (prop) => {
    const value = renderAttribs[prop];
    if (value) {
      styles[prop] = fixSize(value);
    }
  };
  size("width");
  size("height");
  Object.assign(styles, commonProps, useMask ? monotoneProps : coloredProps);
  let customStyle = "";
  for (const key2 in styles) {
    customStyle += key2 + ": " + styles[key2] + ";";
  }
  componentProps.style = customStyle + style;
  return {
    svg: false,
    attributes: componentProps
  };
}
function checkIconState(icon, state, mounted, callback, onload) {
  function abortLoading() {
    if (state.loading) {
      state.loading.abort();
      state.loading = null;
    }
  }
  if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
    state.name = "";
    abortLoading();
    return { data: { ...defaultIconProps, ...icon } };
  }
  let iconName;
  if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
    abortLoading();
    return null;
  }
  const data = getIconData(iconName);
  if (!data) {
    if (mounted && (!state.loading || state.loading.name !== icon)) {
      abortLoading();
      state.name = "";
      state.loading = {
        name: icon,
        abort: loadIcons([iconName], callback)
      };
    }
    return null;
  }
  abortLoading();
  if (state.name !== icon) {
    state.name = icon;
    if (onload && !state.destroyed) {
      onload(icon);
    }
  }
  const classes = ["iconify"];
  if (iconName.prefix !== "") {
    classes.push("iconify--" + iconName.prefix);
  }
  if (iconName.provider !== "") {
    classes.push("iconify--" + iconName.provider);
  }
  return { data, classes };
}
function generateIcon(icon, props) {
  return icon ? render({
    ...defaultIconProps,
    ...icon
  }, props) : null;
}
var matchIconName, stringToIcon, validateIconName, defaultIconDimensions, defaultIconTransformations, defaultIconProps, defaultExtendedIconProps, optionalPropertyDefaults, dataStorage, simpleNames, defaultIconSizeCustomisations, defaultIconCustomisations, unitsSplit, unitsTest, isUnsetKeyword, regex, randomPrefix, counter, storage, configStorage, fallBackAPISources, fallBackAPI, detectFetch, fetchModule, prepare, send, fetchAPIModule, idCounter, defaultConfig, redundancyCache, browserCacheVersion, browserCachePrefix, browserCacheCountKey, browserCacheVersionKey, browserStorageHour, browserStorageCacheExpiration, browserStorageConfig, browserStorageEmptyItems, browserStorageStatus, _window, loadIcons, separator, defaultExtendedIconCustomisations, svgDefaults, commonProps, monotoneProps, coloredProps, propsToAdd, propsToAddTo;
var init_functions = __esm({
  ".svelte-kit/output/server/chunks/functions.js"() {
    matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    stringToIcon = (value, validate, allowSimpleName, provider = "") => {
      const colonSeparated = value.split(":");
      if (value.slice(0, 1) === "@") {
        if (colonSeparated.length < 2 || colonSeparated.length > 3) {
          return null;
        }
        provider = colonSeparated.shift().slice(1);
      }
      if (colonSeparated.length > 3 || !colonSeparated.length) {
        return null;
      }
      if (colonSeparated.length > 1) {
        const name2 = colonSeparated.pop();
        const prefix2 = colonSeparated.pop();
        const result = {
          // Allow provider without '@': "provider:prefix:name"
          provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
          prefix: prefix2,
          name: name2
        };
        return validate && !validateIconName(result) ? null : result;
      }
      const name = colonSeparated[0];
      const dashSeparated = name.split("-");
      if (dashSeparated.length > 1) {
        const result = {
          provider,
          prefix: dashSeparated.shift(),
          name: dashSeparated.join("-")
        };
        return validate && !validateIconName(result) ? null : result;
      }
      if (allowSimpleName && provider === "") {
        const result = {
          provider,
          prefix: "",
          name
        };
        return validate && !validateIconName(result, allowSimpleName) ? null : result;
      }
      return null;
    };
    validateIconName = (icon, allowSimpleName) => {
      if (!icon) {
        return false;
      }
      return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
    };
    defaultIconDimensions = Object.freeze(
      {
        left: 0,
        top: 0,
        width: 16,
        height: 16
      }
    );
    defaultIconTransformations = Object.freeze({
      rotate: 0,
      vFlip: false,
      hFlip: false
    });
    defaultIconProps = Object.freeze({
      ...defaultIconDimensions,
      ...defaultIconTransformations
    });
    defaultExtendedIconProps = Object.freeze({
      ...defaultIconProps,
      body: "",
      hidden: false
    });
    optionalPropertyDefaults = {
      provider: "",
      aliases: {},
      not_found: {},
      ...defaultIconDimensions
    };
    dataStorage = /* @__PURE__ */ Object.create(null);
    simpleNames = false;
    defaultIconSizeCustomisations = Object.freeze({
      width: null,
      height: null
    });
    defaultIconCustomisations = Object.freeze({
      // Dimensions
      ...defaultIconSizeCustomisations,
      // Transformations
      ...defaultIconTransformations
    });
    unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
    unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
    isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
    regex = /\sid="(\S+)"/g;
    randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
    counter = 0;
    storage = /* @__PURE__ */ Object.create(null);
    configStorage = /* @__PURE__ */ Object.create(null);
    fallBackAPISources = [
      "https://api.simplesvg.com",
      "https://api.unisvg.com"
    ];
    fallBackAPI = [];
    while (fallBackAPISources.length > 0) {
      if (fallBackAPISources.length === 1) {
        fallBackAPI.push(fallBackAPISources.shift());
      } else {
        if (Math.random() > 0.5) {
          fallBackAPI.push(fallBackAPISources.shift());
        } else {
          fallBackAPI.push(fallBackAPISources.pop());
        }
      }
    }
    configStorage[""] = createAPIConfig({
      resources: ["https://api.iconify.design"].concat(fallBackAPI)
    });
    detectFetch = () => {
      let callback;
      try {
        callback = fetch;
        if (typeof callback === "function") {
          return callback;
        }
      } catch (err) {
      }
    };
    fetchModule = detectFetch();
    prepare = (provider, prefix2, icons) => {
      const results = [];
      const maxLength = calculateMaxLength(provider, prefix2);
      const type = "icons";
      let item = {
        type,
        provider,
        prefix: prefix2,
        icons: []
      };
      let length = 0;
      icons.forEach((name, index21) => {
        length += name.length + 1;
        if (length >= maxLength && index21 > 0) {
          results.push(item);
          item = {
            type,
            provider,
            prefix: prefix2,
            icons: []
          };
          length = name.length;
        }
        item.icons.push(name);
      });
      results.push(item);
      return results;
    };
    send = (host, params, callback) => {
      if (!fetchModule) {
        callback("abort", 424);
        return;
      }
      let path = getPath(params.provider);
      switch (params.type) {
        case "icons": {
          const prefix2 = params.prefix;
          const icons = params.icons;
          const iconsList = icons.join(",");
          const urlParams = new URLSearchParams({
            icons: iconsList
          });
          path += prefix2 + ".json?" + urlParams.toString();
          break;
        }
        case "custom": {
          const uri = params.uri;
          path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
          break;
        }
        default:
          callback("abort", 400);
          return;
      }
      let defaultError = 503;
      fetchModule(host + path).then((response) => {
        const status = response.status;
        if (status !== 200) {
          setTimeout(() => {
            callback(shouldAbort(status) ? "abort" : "next", status);
          });
          return;
        }
        defaultError = 501;
        return response.json();
      }).then((data) => {
        if (typeof data !== "object" || data === null) {
          setTimeout(() => {
            if (data === 404) {
              callback("abort", data);
            } else {
              callback("next", defaultError);
            }
          });
          return;
        }
        setTimeout(() => {
          callback("success", data);
        });
      }).catch(() => {
        callback("next", defaultError);
      });
    };
    fetchAPIModule = {
      prepare,
      send
    };
    idCounter = 0;
    defaultConfig = {
      resources: [],
      index: 0,
      timeout: 2e3,
      rotate: 750,
      random: false,
      dataAfterTimeout: false
    };
    redundancyCache = /* @__PURE__ */ Object.create(null);
    browserCacheVersion = "iconify2";
    browserCachePrefix = "iconify";
    browserCacheCountKey = browserCachePrefix + "-count";
    browserCacheVersionKey = browserCachePrefix + "-version";
    browserStorageHour = 36e5;
    browserStorageCacheExpiration = 168;
    browserStorageConfig = {
      local: true,
      session: true
    };
    browserStorageEmptyItems = {
      local: /* @__PURE__ */ new Set(),
      session: /* @__PURE__ */ new Set()
    };
    browserStorageStatus = false;
    _window = typeof window === "undefined" ? {} : window;
    loadIcons = (icons, callback) => {
      const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
      const sortedIcons = sortIcons(cleanedIcons);
      if (!sortedIcons.pending.length) {
        let callCallback = true;
        if (callback) {
          setTimeout(() => {
            if (callCallback) {
              callback(
                sortedIcons.loaded,
                sortedIcons.missing,
                sortedIcons.pending,
                emptyCallback
              );
            }
          });
        }
        return () => {
          callCallback = false;
        };
      }
      const newIcons = /* @__PURE__ */ Object.create(null);
      const sources = [];
      let lastProvider, lastPrefix;
      sortedIcons.pending.forEach((icon) => {
        const { provider, prefix: prefix2 } = icon;
        if (prefix2 === lastPrefix && provider === lastProvider) {
          return;
        }
        lastProvider = provider;
        lastPrefix = prefix2;
        sources.push(getStorage(provider, prefix2));
        const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
        if (!providerNewIcons[prefix2]) {
          providerNewIcons[prefix2] = [];
        }
      });
      sortedIcons.pending.forEach((icon) => {
        const { provider, prefix: prefix2, name } = icon;
        const storage2 = getStorage(provider, prefix2);
        const pendingQueue = storage2.pendingIcons || (storage2.pendingIcons = /* @__PURE__ */ new Set());
        if (!pendingQueue.has(name)) {
          pendingQueue.add(name);
          newIcons[provider][prefix2].push(name);
        }
      });
      sources.forEach((storage2) => {
        const { provider, prefix: prefix2 } = storage2;
        if (newIcons[provider][prefix2].length) {
          loadNewIcons(storage2, newIcons[provider][prefix2]);
        }
      });
      return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
    };
    separator = /[\s,]+/;
    defaultExtendedIconCustomisations = {
      ...defaultIconCustomisations,
      inline: false
    };
    svgDefaults = {
      "xmlns": "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      "aria-hidden": true,
      "role": "img"
    };
    commonProps = {
      display: "inline-block"
    };
    monotoneProps = {
      "background-color": "currentColor"
    };
    coloredProps = {
      "background-color": "transparent"
    };
    propsToAdd = {
      image: "var(--svg)",
      repeat: "no-repeat",
      size: "100% 100%"
    };
    propsToAddTo = {
      "-webkit-mask": monotoneProps,
      "mask": monotoneProps,
      "background": coloredProps
    };
    for (const prefix2 in propsToAddTo) {
      const list = propsToAddTo[prefix2];
      for (const prop in propsToAdd) {
        list[prefix2 + "-" + prop] = propsToAdd[prop];
      }
    }
    allowSimpleNames(true);
    setAPIModule("", fetchAPIModule);
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      initBrowserStorage();
      const _window2 = window;
      if (_window2.IconifyPreload !== void 0) {
        const preload = _window2.IconifyPreload;
        const err = "Invalid IconifyPreload syntax.";
        if (typeof preload === "object" && preload !== null) {
          (preload instanceof Array ? preload : [preload]).forEach((item) => {
            try {
              if (
                // Check if item is an object and not null/array
                typeof item !== "object" || item === null || item instanceof Array || // Check for 'icons' and 'prefix'
                typeof item.icons !== "object" || typeof item.prefix !== "string" || // Add icon set
                !addCollection(item)
              ) {
                console.error(err);
              }
            } catch (e) {
              console.error(err);
            }
          });
        }
      }
      if (_window2.IconifyProviders !== void 0) {
        const providers = _window2.IconifyProviders;
        if (typeof providers === "object" && providers !== null) {
          for (let key2 in providers) {
            const err = "IconifyProviders[" + key2 + "] is invalid.";
            try {
              const value = providers[key2];
              if (typeof value !== "object" || !value || value.resources === void 0) {
                continue;
              }
              if (!addAPIProvider(key2, value)) {
                console.error(err);
              }
            } catch (e) {
              console.error(err);
            }
          }
        }
      }
    }
  }
});

// .svelte-kit/output/server/chunks/Icon.js
var Icon;
var init_Icon = __esm({
  ".svelte-kit/output/server/chunks/Icon.js"() {
    init_ssr();
    init_functions();
    Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      const state = {
        // Last icon name
        name: "",
        // Loading status
        loading: null,
        // Destroyed status
        destroyed: false
      };
      let mounted = false;
      let data;
      const onLoad = (icon) => {
        if (typeof $$props.onLoad === "function") {
          $$props.onLoad(icon);
        }
        const dispatch = createEventDispatcher();
        dispatch("load", { icon });
      };
      function loaded() {
      }
      onDestroy(() => {
        state.destroyed = true;
      });
      {
        {
          const iconData = checkIconState($$props.icon, state, mounted, loaded, onLoad);
          data = iconData ? generateIcon(iconData.data, $$props) : null;
          if (data && iconData.classes) {
            data.attributes["class"] = (typeof $$props["class"] === "string" ? $$props["class"] + " " : "") + iconData.classes.join(" ");
          }
        }
      }
      return `${data ? `${data.svg ? `<svg${spread([escape_object(data.attributes)], {})}><!-- HTML_TAG_START -->${data.body}<!-- HTML_TAG_END --></svg>` : `<span${spread([escape_object(data.attributes)], {})}></span>`}` : ``}`;
    });
  }
});

// .svelte-kit/output/server/chunks/theme.store.js
var theme;
var init_theme_store = __esm({
  ".svelte-kit/output/server/chunks/theme.store.js"() {
    init_index2();
    theme = writable("dark");
  }
});

// .svelte-kit/output/server/chunks/Footer.js
var css$1, Theme, css2, Footer;
var init_Footer = __esm({
  ".svelte-kit/output/server/chunks/Footer.js"() {
    init_ssr();
    init_Icon();
    init_theme_store();
    css$1 = {
      code: "#theme_button.svelte-123cx8d{background-color:transparent;outline:none;border:none;padding:0;height:36px;width:36px;aspect-ratio:1;border-radius:100px;transition:transform 0.5s;transform:rotateZ(0deg);color:var(--main);box-shadow:none;color:var(--accent-light)}#theme_button.svelte-123cx8d:hover{background-color:transparent}#theme_button.svelte-123cx8d:focus{background-color:transparent}#theme_button.svelte-123cx8d:active{background-color:transparent}",
      map: null
    };
    Theme = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $theme, $$unsubscribe_theme;
      $$unsubscribe_theme = subscribe(theme, (value) => $theme = value);
      let rotate = 0;
      function changeTheme() {
        console.log("\u{1F313} changing theme");
        if ($theme == "dark") {
          set_store_value(theme, $theme = "light", $theme);
          document.body.classList.add("light");
          document.body.classList.remove("dark");
        } else {
          set_store_value(theme, $theme = "dark", $theme);
          document.body.classList.remove("light");
          document.body.classList.add("dark");
        }
        rotate += 360;
        localStorage.setItem("theme", $theme);
      }
      if ($$props.changeTheme === void 0 && $$bindings.changeTheme && changeTheme !== void 0)
        $$bindings.changeTheme(changeTheme);
      $$result.css.add(css$1);
      $$unsubscribe_theme();
      return `<button id="theme_button" style="${"transform:rotateZ(" + escape(rotate, true) + "deg)"}"${add_attribute("data-theme", $theme, 0)} class="svelte-123cx8d">${$theme == "light" ? `${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "fluent:weather-sunny-16-regular",
          width: "24"
        },
        {},
        {}
      )} ` : ` ${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "solar:moon-bold-duotone",
          width: "24"
        },
        {},
        {}
      )}`} </button>`;
    });
    css2 = {
      code: "footer.svelte-59wpnm.svelte-59wpnm{border-top:1px solid var(--grey-lightest);padding-block:1rem;background-color:var(--bg-p);color:#dedede;display:flex;justify-content:flex-end;padding-inline:1rem}footer.svelte-59wpnm .link.svelte-59wpnm{display:flex;justify-content:space-between;gap:1rem;width:100%}footer.svelte-59wpnm .link a.svelte-59wpnm{gap:0.125rem;display:flex;align-items:center;text-decoration:none;color:#617786;font-size:0.875rem}footer.svelte-59wpnm .link a.svelte-59wpnm:hover{color:orange}",
      map: null
    };
    Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css2);
      return `<footer class="svelte-59wpnm"><div class="link svelte-59wpnm"><a href="/admin" class="svelte-59wpnm"><div class="icon">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "dashicons:admin-network",
          height: "20"
        },
        {},
        {}
      )}</div> <div data-svelte-h="svelte-1guj2eh">Admin</div></a> <a href="https://github.com/merhmerh" class="svelte-59wpnm"><div class="icon">${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:github", height: "20" }, {}, {})}</div> <div data-svelte-h="svelte-ohk0rw">merhmerh</div></a></div> </footer>`;
    });
  }
});

// node_modules/.pnpm/nanoid@4.0.2/node_modules/nanoid/index.browser.js
var random, customRandom, customAlphabet;
var init_index_browser = __esm({
  "node_modules/.pnpm/nanoid@4.0.2/node_modules/nanoid/index.browser.js"() {
    random = (bytes) => crypto.getRandomValues(new Uint8Array(bytes));
    customRandom = (alphabet2, defaultSize, getRandom) => {
      let mask = (2 << Math.log(alphabet2.length - 1) / Math.LN2) - 1;
      let step = -~(1.6 * mask * defaultSize / alphabet2.length);
      return (size = defaultSize) => {
        let id = "";
        while (true) {
          let bytes = getRandom(step);
          let j = step;
          while (j--) {
            id += alphabet2[bytes[j] & mask] || "";
            if (id.length === size)
              return id;
          }
        }
      };
    };
    customAlphabet = (alphabet2, size = 21) => customRandom(alphabet2, size, random);
  }
});

// .svelte-kit/output/server/chunks/helper.js
function capitalizeFirstCharacter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
var alphabet;
var init_helper2 = __esm({
  ".svelte-kit/output/server/chunks/helper.js"() {
    init_module6();
    init_public();
    init_index_browser();
    createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    customAlphabet(alphabet, 20);
  }
});

// .svelte-kit/output/server/chunks/Header.js
var css$2, Search, css$12, HeaderAuth, css3, Header;
var init_Header = __esm({
  ".svelte-kit/output/server/chunks/Header.js"() {
    init_ssr();
    init_Icon();
    init_Footer();
    init_stores();
    init_supabase_store();
    init_helper2();
    css$2 = {
      code: ".container.svelte-bnfm7e.svelte-bnfm7e{display:flex;align-items:center;border:1px solid var(--grey-lighter);border-radius:0.5rem;padding-inline:0.5rem;width:400px}.container.svelte-bnfm7e .icon.svelte-bnfm7e{display:flex;justify-content:center;align-items:center;color:var(--main-light)}.container.svelte-bnfm7e.svelte-bnfm7e:focus-within{border-color:var(--accent-light);background-color:var(--bg-p)}.container.svelte-bnfm7e input.svelte-bnfm7e{background-color:transparent;border:none;display:flex;align-items:center;width:100%;font-size:0.875rem}.container.svelte-bnfm7e input.svelte-bnfm7e:focus{outline:none}.container.svelte-bnfm7e .kbs.svelte-bnfm7e{margin-left:auto;display:flex;gap:0.25rem}.container.svelte-bnfm7e .kbs code.svelte-bnfm7e{font-size:0.75rem;background-color:var(--muted);opacity:0.5}.container.svelte-bnfm7e .kbs .icon.svelte-bnfm7e{color:var(--accent);display:flex;justify-content:center;align-items:center;width:20px;height:20px}",
      map: null
    };
    Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      createEventDispatcher();
      let input;
      let searchText;
      $$result.css.add(css$2);
      return ` <div class="container svelte-bnfm7e"><div class="icon svelte-bnfm7e">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "akar-icons:search",
          hFlip: true,
          height: "18"
        },
        {},
        {}
      )}</div> <input type="text" placeholder="Search" class="svelte-bnfm7e"${add_attribute("this", input, 0)}${add_attribute("value", searchText, 0)}> <div class="kbs svelte-bnfm7e">${``} <code class="svelte-bnfm7e" data-svelte-h="svelte-1x27o61">Ctrl</code> <code class="svelte-bnfm7e" data-svelte-h="svelte-f1qa39">K</code></div> </div>`;
    });
    css$12 = {
      code: ".auth.svelte-1adqzml.svelte-1adqzml{display:flex;justify-content:center;align-items:center;width:36px;height:36px;color:var(--main-light);position:relative}.auth.svelte-1adqzml .user.svelte-1adqzml:hover{color:var(--main);border-color:var(--main)}.auth.svelte-1adqzml .user.showName.svelte-1adqzml{font-size:14px;background-color:var(--accent-alt);color:var(--main-alt);line-height:24px;border:0}.auth.svelte-1adqzml .user.svelte-1adqzml{width:24px;height:24px;border-radius:100%;border:2px solid var(--main-light);display:flex;justify-content:center;align-items:center}.auth.svelte-1adqzml .dropdown.svelte-1adqzml{background-color:var(--bg-p);position:absolute;width:150px;border:1px solid var(--grey-lighter);border-radius:0.5rem;right:0;top:100%;display:grid;gap:0.25rem;overflow:hidden}.auth.svelte-1adqzml .dropdown button.svelte-1adqzml{width:100%;font-weight:400;display:flex;padding:0.5rem 0.75rem;gap:0.75rem;align-items:center;color:var(--main);font-size:0.875rem;text-decoration:none;justify-content:flex-start;gap:1rem}.auth.svelte-1adqzml .dropdown button.svelte-1adqzml svg{color:var(--main-light)}.auth.svelte-1adqzml .dropdown button.svelte-1adqzml:hover{text-decoration:none;background-color:var(--bg-alt)}.modal__content.svelte-1adqzml.svelte-1adqzml{width:400px;display:grid;gap:1rem}",
      map: null
    };
    HeaderAuth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $session, $$unsubscribe_session;
      let $$unsubscribe_supabase;
      $$unsubscribe_session = subscribe(session, (value) => $session = value);
      $$unsubscribe_supabase = subscribe(supabase, (value) => value);
      $$result.css.add(css$12);
      $$unsubscribe_session();
      $$unsubscribe_supabase();
      return `<div class="auth none svelte-1adqzml"><button class="${["none user svelte-1adqzml", $session && $session.user.email ? "showName" : ""].join(" ").trim()}">${!$session ? `${validate_component(Icon, "Icon").$$render($$result, { icon: "ph:user", width: "24" }, {}, {})}` : `${escape($session.user.email.charAt(0).toUpperCase())}`}</button> ${``}</div> ${``}`;
    });
    css3 = {
      code: "header.svelte-whqtl6.svelte-whqtl6{display:flex;justify-content:space-between;position:sticky;top:0;width:100%;padding:1rem;border-bottom:1px solid var(--grey-lightest);backdrop-filter:blur(8px);background:rgba(var(--bg-rgb), 50%);z-index:100}header.svelte-whqtl6 .logo.svelte-whqtl6{display:flex;align-items:center;gap:0.5rem;color:var(--main);text-decoration:none}header.svelte-whqtl6 .logo img.svelte-whqtl6{height:2rem}header.svelte-whqtl6 .logo span.svelte-whqtl6{font-weight:600;font-size:1.25rem}header.svelte-whqtl6 .left.svelte-whqtl6{display:flex;gap:2rem}header.svelte-whqtl6 .right.svelte-whqtl6{display:flex;justify-content:flex-end;width:fit-content}header.svelte-whqtl6 .right nav.svelte-whqtl6{display:flex;margin-right:3rem;gap:2rem;align-items:center}header.svelte-whqtl6 .right nav a.svelte-whqtl6{flex-shrink:0;width:fit-content;color:var(--grey);text-decoration:none;font-weight:400}header.svelte-whqtl6 .right nav a.selected.svelte-whqtl6{color:var(--url)}header.svelte-whqtl6 .right button.icon.svelte-whqtl6{color:var(--main-light);height:100%;aspect-ratio:1;display:flex;justify-content:center;align-items:center}header.svelte-whqtl6 .right button.icon.svelte-whqtl6:hover{color:var(--main)}",
      map: null
    };
    Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      $$result.css.add(css3);
      $$unsubscribe_page();
      return `<header class="svelte-whqtl6"><div class="left svelte-whqtl6"><a class="logo none svelte-whqtl6" href="/" data-svelte-h="svelte-r46o33"><img src="/logo.svg" alt="" class="svelte-whqtl6"> <span class="svelte-whqtl6">IFC-SG Docs</span></a> ${validate_component(Search, "Search").$$render($$result, {}, {}, {})}</div> <div class="center"></div> <div class="right svelte-whqtl6"><nav class="svelte-whqtl6"><a href="/ifcsg" class="${["svelte-whqtl6", $page.url.pathname == "/ifcsg" ? "selected" : ""].join(" ").trim()}" data-svelte-h="svelte-2vd1ru">IFC SG</a>  <a href="/spacename" class="${["svelte-whqtl6", $page.url.pathname == "/spacename" ? "selected" : ""].join(" ").trim()}" data-svelte-h="svelte-1nt732d">SpaceName</a> <a href="/area-gfa" class="${["svelte-whqtl6", $page.url.pathname == "/area-gfa" ? "selected" : ""].join(" ").trim()}" data-svelte-h="svelte-5o5z9b">Area GFA</a> <a href="/modellingguide" class="${[
        "svelte-whqtl6",
        $page.url.pathname == "/modellingguide" ? "selected" : ""
      ].join(" ").trim()}" data-svelte-h="svelte-1bukxqh">ModellingGuide</a></nav> <button class="icon none svelte-whqtl6">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "ic:baseline-refresh",
          height: "24"
        },
        {},
        {}
      )}</button> ${validate_component(Theme, "Theme").$$render($$result, {}, {}, {})} ${validate_component(HeaderAuth, "Auth").$$render($$result, {}, {}, {})}</div> </header>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/_error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2
});
var css4, Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_error.svelte.js"() {
    init_ssr();
    init_stores();
    init_Header();
    init_Footer();
    css4 = {
      code: ".content.svelte-1vaguys.svelte-1vaguys{height:calc(100svh - 70px);display:flex;flex-direction:column;align-items:center;gap:1rem}.content.svelte-1vaguys .status.svelte-1vaguys{margin-top:200px;font-size:80px;font-weight:900}.content.svelte-1vaguys .message.svelte-1vaguys{display:flex;flex-direction:column;align-items:center;gap:0.5rem;font-size:20px}",
      map: null
    };
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      let status;
      $$result.css.add(css4);
      $$unsubscribe_page();
      return `${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <div class="content svelte-1vaguys"><button class="none noHover status svelte-1vaguys">${escape(status)}</button> <div class="message svelte-1vaguys">${$page.error.message == "Not Found" ? `<span data-svelte-h="svelte-tt51nw">Oops! The page you&#39;re looking for could not be found.</span> <span data-svelte-h="svelte-12kmznp">Please check the URL or navigate back to the homepage.</span>` : `${escape($page.error.message)}`}</div></div> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  component: () => component2,
  fonts: () => fonts2,
  imports: () => imports2,
  index: () => index2,
  stylesheets: () => stylesheets2
});
var index2, component_cache2, component2, imports2, stylesheets2, fonts2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    index2 = 1;
    component2 = async () => component_cache2 ?? (component_cache2 = (await Promise.resolve().then(() => (init_error_svelte(), error_svelte_exports))).default);
    imports2 = ["_app/immutable/nodes/1.b21151a3.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/stores.d1a9bb22.js", "_app/immutable/chunks/singletons.1311b0c2.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/paths.3682a10a.js", "_app/immutable/chunks/Header.4e29dab3.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/Footer.23170a6c.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/search.store.a9df220f.js", "_app/immutable/chunks/supabase.store.eea9b4ba.js", "_app/immutable/chunks/Auth.b0457e6a.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/preload-helper.a4192956.js", "_app/immutable/chunks/navigation.54a97f74.js", "_app/immutable/chunks/helper.a19e06e9.js", "_app/immutable/chunks/Modal.674a565a.js"];
    stylesheets2 = ["_app/immutable/assets/1.be713ef8.css", "_app/immutable/assets/Header.611b1de9.css", "_app/immutable/assets/WaterfallSingle.0c89d209.css", "_app/immutable/assets/Footer.7890f430.css", "_app/immutable/assets/Auth.49af9d29.css"];
    fonts2 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(admin)/admin/_layout.server.js
var layout_server_exports2 = {};
__export(layout_server_exports2, {
  load: () => load3
});
async function load3({ locals, url }) {
  const session2 = await locals.getSession();
  const supabase2 = await locals.supabase;
  if (session2) {
    const id = session2.user.id;
    const { data } = await supabase2.auth.admin.getUserById(id);
    if (data.user.user_metadata.disabled) {
      console.log("disabled");
      throw error("403", "Your account have been disabled");
    }
    const role = data.user.user_metadata.role;
    const allowedRoles = ["manager", "admin", "owner"];
    if (!allowedRoles.includes(role)) {
      throw error(403, "Sorry, you do not have permission to access this page.");
    }
    return { session: session2 };
  } else {
    throw redirect(307, `/login?redirect=${url.pathname.replace("/", "")}`);
  }
}
var init_layout_server2 = __esm({
  ".svelte-kit/output/server/entries/pages/(admin)/admin/_layout.server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/chunks/Notify.js
function createCount() {
  const { subscribe: subscribe2, update: update2 } = writable([]);
  function add(msg, opts = {}) {
    const notification = {
      id: generateID(),
      message: msg,
      options: opts
    };
    update2((notifications) => [...notifications, notification]);
    const duration = opts.duration || 5e3;
    setTimeout(() => {
      remove2(notification.id);
    }, duration);
    console.log(notification);
    return notification.id;
  }
  function remove2(id) {
    update2((notifications) => notifications.filter((notification) => notification.id !== id));
  }
  return { subscribe: subscribe2, add, remove: remove2 };
}
function generateID(length) {
  if (!length) {
    length = 8;
  }
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  return id;
}
var notify, css$13, NotifyCard, css5, Notify;
var init_Notify = __esm({
  ".svelte-kit/output/server/chunks/Notify.js"() {
    init_ssr();
    init_index2();
    init_Icon();
    notify = createCount();
    css$13 = {
      code: ".card.svelte-1cn13qs.svelte-1cn13qs{width:350px;background-color:var(--background-secondary);padding:0.5rem;padding-inline:1rem 0.5rem;border-radius:0.5rem;transition:all 0.5s ease-in-out;opacity:1;display:flex;align-items:center}.card.svelte-1cn13qs .icon.svelte-1cn13qs{display:flex;align-items:center;justify-content:center;height:20px}.card.svelte-1cn13qs span.svelte-1cn13qs{padding:0.5rem;width:100%}.card.svelte-1cn13qs .close.svelte-1cn13qs{background-color:transparent;border:none;outline:none;color:inherit;padding:0.25rem;border-radius:0.25rem;font-weight:inherit;width:36px;aspect-ratio:1;flex-shrink:0;display:flex;align-items:center;justify-content:center;padding-left:0.25rem;border-radius:0;border-left:1px solid var(--mono-500)}.card.svelte-1cn13qs .close.svelte-1cn13qs:hover{box-shadow:none;background-color:transparent;color:inherit !important}.card.svelte-1cn13qs .close.svelte-1cn13qs:focus{box-shadow:none}.card.svelte-1cn13qs .close.svelte-1cn13qs:hover{color:var(--accent-500)}",
      map: null
    };
    NotifyCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { notification } = $$props;
      let { opts } = $$props;
      createEventDispatcher();
      if ($$props.notification === void 0 && $$bindings.notification && notification !== void 0)
        $$bindings.notification(notification);
      if ($$props.opts === void 0 && $$bindings.opts && opts !== void 0)
        $$bindings.opts(opts);
      $$result.css.add(css$13);
      return `<div class="card svelte-1cn13qs"><div class="icon svelte-1cn13qs">${!opts.type || opts.type == "info" ? `${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "fluent:info-12-regular",
          height: "24"
        },
        {},
        {}
      )}` : ``} ${opts.type == "copy" ? `${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "mingcute:copy-3-line",
          height: "24"
        },
        {},
        {}
      )}` : ``}</div> <span class="svelte-1cn13qs">${escape(notification)}</span> <button class="close svelte-1cn13qs">${validate_component(Icon, "Icon").$$render($$result, { icon: "mingcute:close-line", width: "20" }, {}, {})}</button> </div>`;
    });
    css5 = {
      code: ".container.svelte-jb3s0o{position:fixed;top:2rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column-reverse;gap:1rem;z-index:600}",
      map: null
    };
    Notify = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $notify, $$unsubscribe_notify;
      $$unsubscribe_notify = subscribe(notify, (value) => $notify = value);
      $$result.css.add(css5);
      $$unsubscribe_notify();
      return `<div class="container svelte-jb3s0o">${each($notify, (card) => {
        return `<div>${validate_component(NotifyCard, "NotifyCard").$$render(
          $$result,
          {
            notification: card.message,
            opts: card.options
          },
          {},
          {}
        )} </div>`;
      })} </div>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/(admin)/admin/_layout.svelte.js
var layout_svelte_exports2 = {};
__export(layout_svelte_exports2, {
  default: () => Layout2
});
var css$14, Aside, css6, Layout2;
var init_layout_svelte2 = __esm({
  ".svelte-kit/output/server/entries/pages/(admin)/admin/_layout.svelte.js"() {
    init_ssr();
    init_Footer();
    init_Icon();
    init_stores();
    init_functions();
    init_Notify();
    css$14 = {
      code: "aside.svelte-1f876lt.svelte-1f876lt{padding-inline:0.5rem;border-right:1px solid var(--mono-200);display:flex;flex-direction:column;gap:0.5rem;padding-block:1rem}aside.svelte-1f876lt a.button.svelte-1f876lt,aside.svelte-1f876lt button.svelte-1f876lt{border:0;width:40px;height:40px;padding:0.5rem}aside.svelte-1f876lt a.button img.svelte-1f876lt,aside.svelte-1f876lt button img.svelte-1f876lt{width:24px;height:24px}aside.svelte-1f876lt a.button.active.svelte-1f876lt{background-color:color-mix(in srgb, var(--accent) 25%, transparent)}",
      map: null
    };
    Aside = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      let theme2;
      $$result.css.add(css$14);
      let $$settled;
      let $$rendered;
      do {
        $$settled = true;
        $$rendered = `<aside class="svelte-1f876lt"><a class="${["button svelte-1f876lt", $page.url.pathname == "/admin" ? "active" : ""].join(" ").trim()}" href="/admin" data-svelte-h="svelte-vh91dx"><img src="/logo.svg" alt="" class="svelte-1f876lt"></a> <a class="${[
          "button svelte-1f876lt",
          $page.url.pathname.replace("/admin/", "") == "users" ? "active" : ""
        ].join(" ").trim()}" href="/admin/users">${validate_component(Icon, "Icon").$$render(
          $$result,
          {
            icon: "grommet-icons:group",
            height: "24"
          },
          {},
          {}
        )}</a> <button class="last svelte-1f876lt" style="margin-top:auto">${validate_component(Theme, "Theme").$$render(
          $$result,
          { this: theme2 },
          {
            this: ($$value) => {
              theme2 = $$value;
              $$settled = false;
            }
          },
          {}
        )}</button> <a class="button last svelte-1f876lt" href="/">${validate_component(Icon, "Icon").$$render($$result, { icon: "ic:outline-home", height: "24" }, {}, {})}</a> </aside>`;
      } while (!$$settled);
      $$unsubscribe_page();
      return $$rendered;
    });
    css6 = {
      code: ".admin__content.svelte-yzq0uc{min-height:100svh;display:grid;grid-template-columns:auto 1fr}.admin__main.svelte-yzq0uc{margin-top:2rem;margin-inline:auto;width:100%;max-width:1400px;padding-inline:2rem}",
      map: null
    };
    Layout2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css6);
      return `<div class="admin__content svelte-yzq0uc">${validate_component(Aside, "Aside").$$render($$result, {}, {}, {})} ${validate_component(Notify, "Notify").$$render($$result, {}, {}, {})} <main class="admin__main svelte-yzq0uc">${slots.default ? slots.default({}) : ``}</main></div> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports3 = {};
__export(__exports3, {
  component: () => component3,
  fonts: () => fonts3,
  imports: () => imports3,
  index: () => index3,
  server: () => layout_server_exports2,
  server_id: () => server_id2,
  stylesheets: () => stylesheets3
});
var index3, component_cache3, component3, server_id2, imports3, stylesheets3, fonts3;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    init_layout_server2();
    index3 = 2;
    component3 = async () => component_cache3 ?? (component_cache3 = (await Promise.resolve().then(() => (init_layout_svelte2(), layout_svelte_exports2))).default);
    server_id2 = "src/routes/(admin)/admin/+layout.server.js";
    imports3 = ["_app/immutable/nodes/2.4ea34efe.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/Footer.23170a6c.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/stores.d1a9bb22.js", "_app/immutable/chunks/singletons.1311b0c2.js", "_app/immutable/chunks/paths.3682a10a.js", "_app/immutable/chunks/Notify.6919b63e.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/index.aead3cc0.js", "_app/immutable/chunks/index.cb398640.js", "_app/immutable/chunks/notify.store.1d2474ed.js"];
    stylesheets3 = ["_app/immutable/assets/2.4ce399a5.css", "_app/immutable/assets/WaterfallSingle.0c89d209.css", "_app/immutable/assets/Footer.7890f430.css"];
    fonts3 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/_layout.server.js
var layout_server_exports3 = {};
__export(layout_server_exports3, {
  load: () => load4
});
async function load4({ locals: { supabase: supabase2, getSession }, url }) {
  const session2 = await getSession();
  if (!session2) {
    return {};
  }
  const id = session2.user.id;
  const { data } = await supabase2.auth.admin.getUserById(id);
  if (data.user.user_metadata.disabled) {
    console.log("disabled");
    throw error("403", "Your account have been disabled");
  }
}
var init_layout_server3 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/_layout.server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/pages/(main)/_layout.svelte.js
var layout_svelte_exports3 = {};
__export(layout_svelte_exports3, {
  default: () => Layout3
});
var css$15, FakeProgress, css7, Layout3;
var init_layout_svelte3 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/_layout.svelte.js"() {
    init_ssr();
    init_Header();
    init_stores();
    init_Footer();
    init_functions();
    init_Notify();
    css$15 = {
      code: ".container.svelte-18qxs8a.svelte-18qxs8a{position:fixed;top:0;width:100%;height:4px;z-index:200}.container.svelte-18qxs8a .progress.svelte-18qxs8a{width:0;transition:width 3s ease-out;height:100%;background-color:var(--accent);animation:svelte-18qxs8a-loading 2s forwards ease-out}@keyframes svelte-18qxs8a-loading{0%{width:0%}100%{width:90%}}",
      map: null
    };
    FakeProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $navigating, $$unsubscribe_navigating;
      $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
      $$result.css.add(css$15);
      $$unsubscribe_navigating();
      return `${$navigating ? `<div class="container svelte-18qxs8a" data-svelte-h="svelte-1dp2hrk"><div class="progress svelte-18qxs8a"></div></div>` : ``}`;
    });
    css7 = {
      code: "main.svelte-xk2js4{display:grid;grid-template-columns:300px 1fr;min-height:calc(100svh - 70px)}",
      map: null
    };
    Layout3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css7);
      return `${validate_component(Notify, "Notify").$$render($$result, {}, {}, {})} ${validate_component(FakeProgress, "FakeProgress").$$render($$result, {}, {}, {})} ${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-xk2js4">${slots.default ? slots.default({}) : ``}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
    });
  }
});

// .svelte-kit/output/server/nodes/3.js
var __exports4 = {};
__export(__exports4, {
  component: () => component4,
  fonts: () => fonts4,
  imports: () => imports4,
  index: () => index4,
  server: () => layout_server_exports3,
  server_id: () => server_id3,
  stylesheets: () => stylesheets4
});
var index4, component_cache4, component4, server_id3, imports4, stylesheets4, fonts4;
var init__4 = __esm({
  ".svelte-kit/output/server/nodes/3.js"() {
    init_layout_server3();
    index4 = 3;
    component4 = async () => component_cache4 ?? (component_cache4 = (await Promise.resolve().then(() => (init_layout_svelte3(), layout_svelte_exports3))).default);
    server_id3 = "src/routes/(main)/+layout.server.js";
    imports4 = ["_app/immutable/nodes/3.800657c4.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/Header.4e29dab3.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/Footer.23170a6c.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/search.store.a9df220f.js", "_app/immutable/chunks/stores.d1a9bb22.js", "_app/immutable/chunks/singletons.1311b0c2.js", "_app/immutable/chunks/paths.3682a10a.js", "_app/immutable/chunks/supabase.store.eea9b4ba.js", "_app/immutable/chunks/Auth.b0457e6a.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/preload-helper.a4192956.js", "_app/immutable/chunks/navigation.54a97f74.js", "_app/immutable/chunks/helper.a19e06e9.js", "_app/immutable/chunks/Modal.674a565a.js", "_app/immutable/chunks/Notify.6919b63e.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/index.aead3cc0.js", "_app/immutable/chunks/index.cb398640.js", "_app/immutable/chunks/notify.store.1d2474ed.js"];
    stylesheets4 = ["_app/immutable/assets/3.b8fcd73e.css", "_app/immutable/assets/WaterfallSingle.0c89d209.css", "_app/immutable/assets/Header.611b1de9.css", "_app/immutable/assets/Footer.7890f430.css", "_app/immutable/assets/Auth.49af9d29.css"];
    fonts4 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/modellingguide/_layout.server.js
var layout_server_exports4 = {};
__export(layout_server_exports4, {
  load: () => load5
});
async function load5({ locals: { supabase: supabase2 } }) {
  const { data, error: error2 } = await supabase2.from("modellingGuide").select().order("title");
  return { modellingGuide: data };
}
var init_layout_server4 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/modellingguide/_layout.server.js"() {
  }
});

// .svelte-kit/output/server/chunks/aside.store.js
var listOfGuides;
var init_aside_store = __esm({
  ".svelte-kit/output/server/chunks/aside.store.js"() {
    init_index2();
    listOfGuides = writable(0);
  }
});

// .svelte-kit/output/server/entries/pages/(main)/modellingguide/_layout.svelte.js
var layout_svelte_exports4 = {};
__export(layout_svelte_exports4, {
  default: () => Layout4
});
var css8, Layout4;
var init_layout_svelte4 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/modellingguide/_layout.svelte.js"() {
    init_ssr();
    init_helper2();
    init_functions();
    init_stores();
    init_aside_store();
    css8 = {
      code: ".newGuideModal.svelte-16cupnv.svelte-16cupnv{width:600px;display:flex;flex-direction:column;gap:1rem}.newGuideModal.svelte-16cupnv input.svelte-16cupnv{width:100%}.newGuideModal.svelte-16cupnv input.title.svelte-16cupnv{font-weight:600;font-size:1.5rem}.newGuideModal.svelte-16cupnv button.autoSlug.svelte-16cupnv{color:var(--accent)}.newGuideModal.svelte-16cupnv button.autoSlug.off.svelte-16cupnv{color:var(--grey)}aside.svelte-16cupnv.svelte-16cupnv{position:sticky;top:70px;height:calc(100svh - 70px);overflow-y:auto;border-right:1px solid var(--grey-lighter);display:flex;flex-direction:column;padding:1rem}aside.svelte-16cupnv .list.svelte-16cupnv{display:flex;flex-direction:column;height:100%;gap:0.5rem}aside.svelte-16cupnv .list a.svelte-16cupnv{background-color:var(--bg-s);border-radius:0.5rem;padding:0.5rem;font-size:1rem;width:100%;justify-content:space-between;align-items:center;color:var(--main);text-decoration:none;height:auto}aside.svelte-16cupnv .list a.selected.svelte-16cupnv{background-color:var(--accent);color:var(--main-alt)}aside.svelte-16cupnv button.add.svelte-16cupnv{margin-top:auto;height:auto}.content.svelte-16cupnv.svelte-16cupnv{position:relative;padding-top:2rem;margin-inline:auto;width:1100px;min-height:calc(100svh - 70px);padding-bottom:100px;display:flex;flex-direction:column;gap:0.5rem}",
      map: null
    };
    Layout4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $listOfGuides, $$unsubscribe_listOfGuides;
      let $page, $$unsubscribe_page;
      $$unsubscribe_listOfGuides = subscribe(listOfGuides, (value) => $listOfGuides = value);
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      let { data } = $$props;
      listOfGuides.set(data.modellingGuide);
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css8);
      $$unsubscribe_listOfGuides();
      $$unsubscribe_page();
      return `<aside class="svelte-16cupnv"><div class="list svelte-16cupnv">${each($listOfGuides, (doc) => {
        return `<a href="${"/modellingguide/" + escape(doc.slug, true)}" class="${["svelte-16cupnv", $page.params.slug == doc.slug ? "selected" : ""].join(" ").trim()}">${escape(doc.title)}</a>`;
      })}</div> <button class="add svelte-16cupnv" data-svelte-h="svelte-t0f4p1">Add New Guide</button></aside> <div class="content svelte-16cupnv">${slots.default ? slots.default({}) : ``}</div> ${``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/4.js
var __exports5 = {};
__export(__exports5, {
  component: () => component5,
  fonts: () => fonts5,
  imports: () => imports5,
  index: () => index5,
  server: () => layout_server_exports4,
  server_id: () => server_id4,
  stylesheets: () => stylesheets5
});
var index5, component_cache5, component5, server_id4, imports5, stylesheets5, fonts5;
var init__5 = __esm({
  ".svelte-kit/output/server/nodes/4.js"() {
    init_layout_server4();
    index5 = 4;
    component5 = async () => component_cache5 ?? (component_cache5 = (await Promise.resolve().then(() => (init_layout_svelte4(), layout_svelte_exports4))).default);
    server_id4 = "src/routes/(main)/modellingguide/+layout.server.js";
    imports5 = ["_app/immutable/nodes/4.db804eed.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/helper.a19e06e9.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/preload-helper.a4192956.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/Modal.674a565a.js", "_app/immutable/chunks/stores.d1a9bb22.js", "_app/immutable/chunks/singletons.1311b0c2.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/paths.3682a10a.js", "_app/immutable/chunks/aside.store.56b6926c.js"];
    stylesheets5 = ["_app/immutable/assets/4.f8be6ed2.css", "_app/immutable/assets/WaterfallSingle.0c89d209.css"];
    fonts5 = [];
  }
});

// .svelte-kit/output/server/chunks/data_space_ot_pdt.js
var spaceName, occupancyType, projectDevelopmentType, spaceNameJson;
var init_data_space_ot_pdt = __esm({
  ".svelte-kit/output/server/chunks/data_space_ot_pdt.js"() {
    spaceName = [
      {
        category: "Living spaces",
        spaceName: "balcony",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "bedroom",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "master bedroom",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "bathroom",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "master bath",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "maid bath",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "yard bath",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "dining room | dining area",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "household shelter",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "kitchen",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "living room | living area",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "loft",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "private lift lobby",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "service yard",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "toilet",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Living spaces",
        spaceName: "walkin wardrobe",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Apartment, residential | Maisonettes, residential",
        occupancyLoad: 15
      },
      {
        category: "Temporary residences",
        spaceName: "any",
        occupancyType: "hotel",
        remarks: null,
        functionalSpace: "Backpacker hotel",
        occupancyLoad: 3
      },
      {
        category: "Temporary residences",
        spaceName: "any",
        occupancyType: "serviced apartment",
        remarks: null,
        functionalSpace: "Serviced apartment (based on per unit)",
        occupancyLoad: 15
      },
      {
        category: "Temporary residences",
        spaceName: "bedroom",
        occupancyType: "dormitory",
        remarks: null,
        functionalSpace: "Dormitory",
        occupancyLoad: 4.2
      },
      {
        category: "Temporary residences",
        spaceName: "bedroom",
        occupancyType: "workers dormitory",
        remarks: null,
        functionalSpace: "Dormitory",
        occupancyLoad: 4.2
      },
      {
        category: "Temporary residences",
        spaceName: "guestroom",
        occupancyType: "hotel",
        remarks: null,
        functionalSpace: "Guestroom/accommodation unit",
        occupancyLoad: "Min 2 persons per room or 15msq/person, whichever is higher"
      },
      {
        category: "Temporary residences",
        spaceName: "guestroom",
        occupancyType: "hostel",
        remarks: null,
        functionalSpace: "Guestroom/accommodation unit",
        occupancyLoad: "Min 2 persons per room or 15msq/person, whichever is higher"
      },
      {
        category: "Temporary residences",
        spaceName: "guestroom",
        occupancyType: "capsule hotel",
        remarks: null,
        functionalSpace: "Guestroom/accommodation unit",
        occupancyLoad: 3
      },
      {
        category: "Temporary residences",
        spaceName: "staff quarters",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Staff quarters",
        occupancyLoad: "Min 2 persons per room or 15msq/person, whichever is higher"
      },
      {
        category: "Temporary residences",
        spaceName: "student bedroom individual",
        occupancyType: "hostel",
        remarks: null,
        functionalSpace: "Student bedroom",
        occupancyLoad: "Min 2 persons per room or 15msq/person, whichever is higher"
      },
      {
        category: "Temporary residences",
        spaceName: "student bedroom multipax",
        occupancyType: "hostel",
        remarks: null,
        functionalSpace: "Student bedroom",
        occupancyLoad: 3
      },
      {
        category: "Temporary residences",
        spaceName: "housekeeping",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Housekeeping",
        occupancyLoad: 10
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "bathroom",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level. \n\nBarrierFreeAccessibility [Boolean]\nTo indicate true for accessible washroom/ toilets and cubicles.",
        functionalSpace: "Bath room",
        occupancyLoad: 0
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "toilet",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level. \n\nBarrierFreeAccessibility [Boolean]\nTo indicate true for accessible washroom/ toilets and cubicles.",
        functionalSpace: "Toilet",
        occupancyLoad: 0
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "isolation ward toilet",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level. \n\nBarrierFreeAccessibility [Boolean]\nTo indicate true for accessible washroom/ toilets and cubicles.",
        functionalSpace: "Toilet",
        occupancyLoad: 0
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "accessible washroom",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level.\n\nBarrierFreeAccessibility [Boolean] = True",
        functionalSpace: "Toilet (handicap)",
        occupancyLoad: 0
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "male toilet",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level.\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Toilet (male)",
        occupancyLoad: 0
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "female toilet",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level.\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Toilet (female)",
        occupancyLoad: 0
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "unisex toilet",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level.\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Toilet",
        occupancyLoad: 0
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "family-friendly washroom",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level.\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Family-friendly washroom",
        occupancyLoad: 0
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "washroom with shower",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level.\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Washroom with shower",
        occupancyLoad: 0
      },
      {
        category: "Toilet spaces \n(non-residential)",
        spaceName: "powder room",
        occupancyType: null,
        remarks: "Referring to spaces containing water closet. Space may be indicated at cubicle level.\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Powder room",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "bathroom",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Bath room",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "changing room",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Changing room",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "female changing room",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Changing room (female)",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "male changing room",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Changing room (male)",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "locker room",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Locker room",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "restroom",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Restroom",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "lactation room",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "lactation room",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "sick room",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Sick room",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "shower room | shower stall",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "shower room | shower stall",
        occupancyLoad: 0
      },
      {
        category: "Resting/ Care/ Hygiene spaces",
        spaceName: "wash area",
        occupancyType: null,
        remarks: "Refer to spaces without water closet\n\nChildrenFriendly [Boolean]\nTo indicate true for child-friendly washroom/ toilets and cubicles\n\nAmbulantDisabled [Boolean]\nTo indicate true for ambulant disabled washroom/ toilets and cubicles",
        functionalSpace: "Wash area",
        occupancyLoad: 0
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "archive room (reading)",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Archive room - reading area",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "archive room (stack)",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Archive room - stack area",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "ball room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Ball room",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "banking hall",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Banking hall",
        occupancyLoad: 3
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "bazaar",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Bazaar",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "business centre",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Business centre/office",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "business office",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Business centre/office",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "classroom",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Classroom",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "computer classroom",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Computer classroom",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "common room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Common room",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "computer room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Computer room",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "conference room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Conference room",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "consultant room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Consultant room",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "crematoria",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Crematoria",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "dance studio",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Dance studio",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "department store",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Department store",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "design studio",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Design studio",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "detention room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Detention room",
        occupancyLoad: 3
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "exposition",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Exposition/trade fair area",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "trade fair area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Exposition/trade fair area",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "filing room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Filing room/store",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "store",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Filing room/store",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "fire command centre",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Fire command centre",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "function room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Function room",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "exhibits gallery",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Gallery - exhibits",
        occupancyLoad: 2.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "choir gallery",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Gallery - choir",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "prayer gallery",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Gallery - prayer",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "seating gallery",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Gallery - seating",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "trading gallery",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Gallery - trading",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "viewing gallery",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Gallery - viewing",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "guard house",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Guard house",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "hobby room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Hobby room",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "kiosk",
        occupancyType: "shop",
        remarks: null,
        functionalSpace: "Kiosk - retail",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "laboratory",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Laboratory",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "laboratory",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Laboratory",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "laundry",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Laundry - with machine operation",
        occupancyLoad: 15
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "library room (stack)",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Library room - stack area",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "library room (reading)",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Library room - reading area",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "lounge",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lounge",
        occupancyLoad: 2.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "machine/printing room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Machine/printing room",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "mailroom",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mailroom",
        occupancyLoad: 0
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "meeting room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Meeting room",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "music studio",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Music studio",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "night club",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Night club",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "admin office",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Office - admin/general",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "general office",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Office - admin/general",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "ancillary office",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Office - ancillary",
        occupancyLoad: 7.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "director office",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Office - director/manager",
        occupancyLoad: 15
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "manager office",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Office - director/manager",
        occupancyLoad: 15
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "drafting office",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Office - drafting",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "outdoor display area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Outdoor display area",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "packing area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Packing/distribution area",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "distribution area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Packing/distribution area",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "pantry",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pantry",
        occupancyLoad: 0
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "prayer hall",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Prayer hall",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "pre-function room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pre-function room",
        occupancyLoad: 0
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "production area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Production area",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "promotion area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Promotion area",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "reading room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Reading room",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "reception area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Reception area",
        occupancyLoad: 3
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "seminar room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Seminar room",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "security room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Security room",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "service area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Service area",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "shed",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Shed",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "shop",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Shop",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "showflat",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Showflat",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "showroom",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Showroom",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "society room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Society room",
        occupancyLoad: 1.5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "spray painting room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Spray painting room",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "staff office",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Staff office",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "staff lounge",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Staff lounge",
        occupancyLoad: 3
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "supermarket",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Supermarket",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "therapy centre",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Therapy centre",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "ticketing office",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Ticketing office",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "trading floor",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Trading floor",
        occupancyLoad: 2
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "visitors lounge",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Visitors lounge",
        occupancyLoad: 3
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "waiting area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Waiting area",
        occupancyLoad: 3
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "public education institution",
        remarks: null,
        functionalSpace: "Workshop - institutional",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "private education institution",
        remarks: null,
        functionalSpace: "Workshop - institutional",
        occupancyLoad: 5
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "petrol station",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "factory",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "food production factory",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "M&E area",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "wafer fabrication plant",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "waste management and recycling",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "embalming facility",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "agriculture",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "animal related facility",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "high containment facility",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "electrical & gas facility",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Commercial, Work, Institutional spaces",
        spaceName: "workshop",
        occupancyType: "road tunnel",
        remarks: null,
        functionalSpace: "Workshop - industrial",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "bar",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Bar/pub",
        occupancyLoad: 1
      },
      {
        category: "Food and Beverages",
        spaceName: "pub",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Bar/pub",
        occupancyLoad: 1
      },
      {
        category: "Food and Beverages",
        spaceName: "cafeteria",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Cafeteria",
        occupancyLoad: 1.5
      },
      {
        category: "Food and Beverages",
        spaceName: "canteen",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Canteen",
        occupancyLoad: 1.5
      },
      {
        category: "Food and Beverages",
        spaceName: "dining area",
        occupancyType: "F&B outlet",
        remarks: null,
        functionalSpace: "Dining area - coffee shop/eating house/food court/hawker centre",
        occupancyLoad: 1.5
      },
      {
        category: "Food and Beverages",
        spaceName: "dining area",
        occupancyType: "ORA",
        remarks: null,
        functionalSpace: "Dining area - coffee shop/eating house/food court/hawker centre",
        occupancyLoad: 1.5
      },
      {
        category: "Food and Beverages",
        spaceName: "dining area",
        occupancyType: "food centre",
        remarks: null,
        functionalSpace: "Dining area - coffee shop/eating house/food court/hawker centre",
        occupancyLoad: 1.5
      },
      {
        category: "Food and Beverages",
        spaceName: "dining area",
        occupancyType: "fast food outlet",
        remarks: null,
        functionalSpace: "Dining area - fast food outlet",
        occupancyLoad: 1
      },
      {
        category: "Food and Beverages",
        spaceName: "food stall",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Food stall",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "kiosk",
        occupancyType: "F&B outlet",
        remarks: null,
        functionalSpace: "Kiosk - take-away F&B",
        occupancyLoad: 5
      },
      {
        category: "Food and Beverages",
        spaceName: "kitchen",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "kitchen",
        occupancyType: "hotel",
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "kitchen",
        occupancyType: "hospital without A&E services",
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "kitchen",
        occupancyType: "hospital with A&E services",
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "kitchen",
        occupancyType: "factory",
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "kitchen",
        occupancyType: "F&B outlet",
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "kitchen",
        occupancyType: "food production factory",
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "kitchen",
        occupancyType: "food centre",
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "service area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "service counter",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Kitchen/service area/service counter",
        occupancyLoad: 10
      },
      {
        category: "Food and Beverages",
        spaceName: "pub",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pub",
        occupancyLoad: 1
      },
      {
        category: "Food and Beverages",
        spaceName: "restaurant",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Restaurant",
        occupancyLoad: 1.5
      },
      {
        category: "Food and Beverages",
        spaceName: "snack bar",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Snack bar",
        occupancyLoad: 1.5
      },
      {
        category: "Food and Beverages",
        spaceName: "staff canteen",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Staff canteen",
        occupancyLoad: 1.5
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "ambulatory care facility",
        remarks: null,
        functionalSpace: "Area of refuge - ambulatory care facility",
        occupancyLoad: 1.4
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "ambulatory care facility (standalone)",
        remarks: null,
        functionalSpace: "Area of refuge - ambulatory care facility",
        occupancyLoad: 1.4
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "custodian care facility",
        remarks: null,
        functionalSpace: "Area of refuge - custodian care facility",
        occupancyLoad: 1.4
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "custodian care facility (nursery)",
        remarks: null,
        functionalSpace: "Area of refuge - custodian care facility",
        occupancyLoad: 1.4
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "hospital without A&E services",
        remarks: "MC to detect patient accomodation area to determine OT is with or without patient accomodation",
        functionalSpace: "Area of refuge - hospital space with patient accomodation",
        occupancyLoad: 2.8
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "hospital with A&E services",
        remarks: "MC to detect patient accomodation area to determine OT is with or without patient accomodation",
        functionalSpace: "Area of refuge - hospital space with patient accomodation",
        occupancyLoad: 2.8
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "hospital without A&E services",
        remarks: "MC to detect patient accomodation area to determine OT is with or without patient accomodation",
        functionalSpace: "Area of refuge - hospital space without patient accomodation",
        occupancyLoad: 0.56
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "hospital with A&E services",
        remarks: "MC to detect patient accomodation area to determine OT is with or without patient accomodation",
        functionalSpace: "Area of refuge - hospital space without patient accomodation",
        occupancyLoad: 0.56
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "nursing care facilities",
        remarks: "MC to detect patient accomodation area to determine OT is with or without patient accomodation",
        functionalSpace: "Area of refuge - nursing care facility space with patient accomodation",
        occupancyLoad: 2.8
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "nursing care facilities",
        remarks: "MC to detect patient accomodation area to determine OT is with or without patient accomodation",
        functionalSpace: "Area of refuge - nursing care facility space without patient accomodation",
        occupancyLoad: 0.56
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "assisted living facility",
        remarks: null,
        functionalSpace: "Area of refuge - supervisory care facility",
        occupancyLoad: 0.56
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "supervisory care facility",
        remarks: null,
        functionalSpace: "Area of refuge - supervisory care facility",
        occupancyLoad: 0.56
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "area of refuge",
        occupancyType: "supervisory care facility (detention)",
        remarks: null,
        functionalSpace: "Area of refuge - supervisory care facility",
        occupancyLoad: 0.56
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "consultation room",
        occupancyType: "outpatient clinic",
        remarks: null,
        functionalSpace: "Clinic (outpatient) - Consultation room",
        occupancyLoad: 5
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "examination room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Examination room",
        occupancyLoad: 5
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "surgical viewing gallery",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Gallery - surgical viewing",
        occupancyLoad: 3
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "assisted living facility",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "supervisory care facility",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "supervisory care facility (detention)",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "nursing care facilityies",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "hospital without A&E services",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "hospital with A&E services",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "ambulatory care facility",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "ambulatory care facility (standalone)",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "custodian care facility",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "custodian care facility (nursery)",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "outpatient clinic",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "laboratory",
        occupancyType: "polyclinic",
        remarks: null,
        functionalSpace: "Laboratory - healthcare occupancy",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "nursing room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Nursing room",
        occupancyLoad: 0
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "nursing station",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Nursing station",
        occupancyLoad: 10
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "operation theatre",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Operation theatre",
        occupancyLoad: 7.5
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "outpatient waiting area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Out-patient waiting area",
        occupancyLoad: 1.5
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "patient accommodation intensive care",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Patient accommodation - intensive care",
        occupancyLoad: 20
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "patient accommodation ward",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Patient accommodation - ward",
        occupancyLoad: 10
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "isolation ward",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Isolation ward",
        occupancyLoad: 10
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "pharmacy staff area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pharmacy - staff area",
        occupancyLoad: 10
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "pharmacy waiting area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pharmacy - public waiting area",
        occupancyLoad: 2
      },
      {
        category: "Medical/ Healthcare",
        spaceName: "treatment room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Treatment room",
        occupancyLoad: 5
      },
      {
        category: "Assembly spaces",
        spaceName: "amphitheatre",
        occupancyType: null,
        remarks: "Refers to amphitheatres with covering/ roof/ shelter or at upper storey of a building, MC to additionally check for these conditions for SCDF\n\nBIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Amphitheatre with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "amphitheatre",
        occupancyType: null,
        remarks: "Refers to amphitheatres with covering/ roof/ shelter or at upper storey of a building, MC to additionally check for these conditions for SCDF\n\nBIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Amphitheatre with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "amphitheatre without fixed seating",
        occupancyType: null,
        remarks: "Refers to amphitheatres with covering/ roof/ shelter or at upper storey of a building, MC to additionally check for these conditions for SCDF",
        functionalSpace: "Amphitheatre without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "auditorium",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Auditorium - with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "auditorium",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Auditorium - with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "auditorium without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Auditorium - without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "cinema",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Cinema - with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "cinema",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Cinema - with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "cinema without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Cinema - without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "grandstand",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Grandstand with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "grandstand",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Grandstand with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "grandstand without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Grandstand without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "assembly hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Hall - assembly hall with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "assembly hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Hall - assembly hall with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "assembly hall without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Hall - assembly hall without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "concert hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Hall - concert hall with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "concert hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Hall - concert hall with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "concert hall without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Hall - concert hall without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "exhibition hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Hall - exhibition hall with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "exhibition hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Hall - exhibition hall with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "exhibition hall without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Hall - exhibition hall without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "conference hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Hall - conference hall with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "conference hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Hall - conference hall with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "conference hall without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Hall - conference hall without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "function hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Hall - function hall with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "function hall",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Hall - function hall with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "function hall without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Hall - function hall without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "lecture room",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Lecture room with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "lecture room",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Lecture room with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "lecture room without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lecture room without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "spectator area",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Spectator area with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "spectator area",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Spectator area with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "spectator area without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Spectator area without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "theatre",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.BENCH",
        functionalSpace: "Theatre with fixed bench seating",
        occupancyLoad: "0.45m of length of benches per person"
      },
      {
        category: "Assembly spaces",
        spaceName: "theatre",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcFurniture.CHAIR",
        functionalSpace: "Theatre with individual fixed seating",
        occupancyLoad: "based on number of fixed seating"
      },
      {
        category: "Assembly spaces",
        spaceName: "theatre without fixed seating",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Theatre without individual fixed seating/bench",
        occupancyLoad: 1.5
      },
      {
        category: "Assembly spaces",
        spaceName: "indoor sport hall",
        occupancyType: "public education institution",
        remarks: "MC to check if project contains multipurpose hall",
        functionalSpace: "Indoor sport hall - school with multi-purpose hall",
        occupancyLoad: 3
      },
      {
        category: "Assembly spaces",
        spaceName: "indoor sport hall",
        occupancyType: "private education institution",
        remarks: "MC to check if project contains multipurpose hall",
        functionalSpace: "Indoor sport hall - school with multi-purpose hall",
        occupancyLoad: 3
      },
      {
        category: "Assembly spaces",
        spaceName: "indoor sport hall",
        occupancyType: "public education institution",
        remarks: "MC to check if project contains multipurpose hall",
        functionalSpace: "Indoor sport hall - school without multi-purpose hall",
        occupancyLoad: 1
      },
      {
        category: "Assembly spaces",
        spaceName: "indoor sport hall",
        occupancyType: "private education institution",
        remarks: null,
        functionalSpace: "Indoor sport hall - school without multi-purpose hall",
        occupancyLoad: 1
      },
      {
        category: "Assembly spaces",
        spaceName: "multi-purpose hall",
        occupancyType: "public education institution",
        remarks: null,
        functionalSpace: "Multi-purpose hall/room - school/colleges",
        occupancyLoad: 1
      },
      {
        category: "Assembly spaces",
        spaceName: "multi-purpose hall",
        occupancyType: "private education institution",
        remarks: null,
        functionalSpace: "Multi-purpose hall/room - school/colleges",
        occupancyLoad: 1
      },
      {
        category: "Assembly spaces",
        spaceName: "multi-purpose room",
        occupancyType: "public education institution",
        remarks: null,
        functionalSpace: "Multi-purpose hall/room - school/colleges",
        occupancyLoad: 1
      },
      {
        category: "Assembly spaces",
        spaceName: "multi-purpose room",
        occupancyType: "private education institution",
        remarks: null,
        functionalSpace: "Multi-purpose hall/room - school/colleges",
        occupancyLoad: 1
      },
      {
        category: "Assembly spaces",
        spaceName: "multi-purpose sports hall",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Multi-purpose sports hall - public sport complex",
        occupancyLoad: 3
      },
      {
        category: "Assembly spaces",
        spaceName: "multi-purpose sports hall",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Multi-purpose sports hall - public swimming complex",
        occupancyLoad: 3
      },
      {
        category: "Assembly spaces",
        spaceName: "multi-purpose sports hall",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Multi-purpose sports hall - stadium",
        occupancyLoad: 3
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "audio visual area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Audio visual area",
        occupancyLoad: 3
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "audio visual control room",
        occupancyType: "assembly place",
        remarks: null,
        functionalSpace: "Audio visual control room - auditorium/theatre/cinema/hall",
        occupancyLoad: 5
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "audio visual control room",
        occupancyType: "cinema",
        remarks: null,
        functionalSpace: "Audio visual control room - auditorium/theatre/cinema/hall",
        occupancyLoad: 5
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "audio visual lighting control room",
        occupancyType: "assembly place",
        remarks: null,
        functionalSpace: "Lighting control room - auditorium/theatre/cinema/hall",
        occupancyLoad: 5
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "audio visual lighting control room",
        occupancyType: "cinema",
        remarks: null,
        functionalSpace: "Lighting control room - auditorium/theatre/cinema/hall",
        occupancyLoad: 5
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "live entertainment",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Live entertainment",
        occupancyLoad: 3
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "live performance",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Live performance",
        occupancyLoad: 3
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "orchestral pit",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Orchestral pit",
        occupancyLoad: 1.5
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "projection room",
        occupancyType: "assembly place",
        remarks: null,
        functionalSpace: "Projection room - auditorium/theatre/cinema/hall",
        occupancyLoad: 5
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "projection room",
        occupancyType: "cinema",
        remarks: null,
        functionalSpace: "Projection room - auditorium/theatre/cinema/hall",
        occupancyLoad: 5
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "back stage",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Stage, back",
        occupancyLoad: 3
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "front stage",
        occupancyType: "public education institution",
        remarks: null,
        functionalSpace: "Stage, front - schools/colleges/tertiary institutions",
        occupancyLoad: 3
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "front stage",
        occupancyType: "private education institution",
        remarks: null,
        functionalSpace: "Stage, front - schools/colleges/tertiary institutions",
        occupancyLoad: 3
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "front stage",
        occupancyType: "assembly place",
        remarks: null,
        functionalSpace: "Stage, front - auditorium/theatre/cinema/hall",
        occupancyLoad: 0
      },
      {
        category: "Supporting spaces for performing",
        spaceName: "front stage",
        occupancyType: "cinema",
        remarks: null,
        functionalSpace: "Stage, front - auditorium/theatre/cinema/hall",
        occupancyLoad: 0
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "amusement park",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Amusement park (excluding machine area)",
        occupancyLoad: 1
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "billiards room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Billiards room",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "body massage",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Body massage",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "bowling alley",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Bowling alley (excluding bowling lane)",
        occupancyLoad: 1
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "bowling lane",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Bowling lane",
        occupancyLoad: 0
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "casino",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Casino",
        occupancyLoad: 1.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "children playground",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Children playground",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "club room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Club room",
        occupancyLoad: 1.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "discotheque dancing area",
        occupancyType: "entertainment place",
        remarks: null,
        functionalSpace: "Discotheque",
        occupancyLoad: 1
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "discotheque dining area",
        occupancyType: "entertainment place",
        remarks: null,
        functionalSpace: "Discotheque",
        occupancyLoad: 1
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "hockey field",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Field/pitch - Hockey field/pitch",
        occupancyLoad: "22 persons"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "hockey pitch",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Field/pitch - Hockey field/pitch",
        occupancyLoad: "22 persons"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "rugby field",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Field/pitch - Rugby field/pitch",
        occupancyLoad: "30 persons"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "rugby pitch",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Field/pitch - Rugby field/pitch",
        occupancyLoad: "30 persons"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "soccer field",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Field/pitch - Soccer field/pitch",
        occupancyLoad: "22 persons"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "soccer pitch",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Field/pitch - Soccer field/pitch",
        occupancyLoad: "22 persons"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "fitness corner",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Fitness/exercise/health corner",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "foot reflexology",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Foot reflexology",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "fitness club",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Fitness/exercise/health club/centre",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "fitness centre",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Fitness/exercise/health club/centre",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "gaming centre",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Gaming centre (excluding machine area)",
        occupancyLoad: 1.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "gymnasium",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Gymnasium",
        occupancyLoad: 3.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "health club",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Health club/centre",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "health centre",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Health club/centre",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "indoor games room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Indoor games room",
        occupancyLoad: 1.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "karaoke lounge",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Karaoke lounge",
        occupancyLoad: 1.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "karaoke dining area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Karaoke dining area",
        occupancyLoad: 1.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "recreation room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Recreation room",
        occupancyLoad: 1.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "refreshmen area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Refreshment area",
        occupancyLoad: 1.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "skating rink",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Skating rink - rink area",
        occupancyLoad: 3
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "spa",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Spa",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "badminton court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Badminton court",
        occupancyLoad: "4 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "basketball court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Basketball court",
        occupancyLoad: "10 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "basketball half court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Basketball court (half-court)",
        occupancyLoad: "6 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "futsal court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Futsal court",
        occupancyLoad: "14 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "netball court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Netball court",
        occupancyLoad: "14 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "netball half court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Netball court (half-court)",
        occupancyLoad: "8 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "squash court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Squash court",
        occupancyLoad: "2 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "tennis court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Tennis court",
        occupancyLoad: "4 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "tennis half court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Tennis court (half-court)",
        occupancyLoad: "2 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "volleyball court",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sports court - Volleyball court",
        occupancyLoad: "12 persons per court"
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Swimming pool - condominium/apartment",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool",
        occupancyType: "hotel",
        remarks: null,
        functionalSpace: "Swimming pool - hotel",
        occupancyLoad: 0
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool",
        occupancyType: "social club",
        remarks: null,
        functionalSpace: "Swimming pool - private club",
        occupancyLoad: 0
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Swimming pool - public sports complex",
        occupancyLoad: 2.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Swimming pool - public swimming complex",
        occupancyLoad: 2.5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool",
        occupancyType: "serviced apartment",
        remarks: null,
        functionalSpace: "Swimming pool - serviced apartment",
        occupancyLoad: 0
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool deck",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Swimming pool deck - condominium/apartment",
        occupancyLoad: 10
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool deck",
        occupancyType: "hotel",
        remarks: null,
        functionalSpace: "Swimming pool deck - hotel",
        occupancyLoad: 10
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool deck",
        occupancyType: "social club",
        remarks: null,
        functionalSpace: "Swimming pool deck - private club",
        occupancyLoad: 10
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool deck",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Swimming pool deck - public sports complex",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool deck",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Swimming pool deck - public swimming complex",
        occupancyLoad: 5
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "swimming pool deck",
        occupancyType: "serviced apartment",
        remarks: null,
        functionalSpace: "Swimming pool deck - serviced apartment",
        occupancyLoad: 10
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "training area",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Training area - public sports complex",
        occupancyLoad: 3
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "training area",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Training area - public swimming complex",
        occupancyLoad: 3
      },
      {
        category: "Entertainment / recreation spaces",
        spaceName: "training area",
        occupancyType: "sports facility",
        remarks: null,
        functionalSpace: "Training area - stadium",
        occupancyLoad: 3
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "ac ledge",
        occupancyType: null,
        remarks: null,
        functionalSpace: "-",
        occupancyLoad: "-"
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "backyard",
        occupancyType: null,
        remarks: null,
        functionalSpace: "-",
        occupancyLoad: "-"
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "courtyard",
        occupancyType: null,
        remarks: null,
        functionalSpace: "-",
        occupancyLoad: "-"
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "service yard",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Service yard",
        occupancyLoad: 10
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "construction site",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Construction site - open to space",
        occupancyLoad: 0
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "outdoor refreshment area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Outdoor refreshment area",
        occupancyLoad: 1.5
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "pavilion",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pavilion",
        occupancyLoad: 1.5
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "roof",
        occupancyType: "sky garden/ terrace",
        remarks: null,
        functionalSpace: "Roof (public)",
        occupancyLoad: 1.5
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "roof",
        occupancyType: "M&E area",
        remarks: null,
        functionalSpace: "Roof (access for maintenance only)",
        occupancyLoad: 0
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "green roof",
        occupancyType: "sky garden/ terrace",
        remarks: null,
        functionalSpace: "Roof - green roof (public)",
        occupancyLoad: 1.5
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "green roof",
        occupancyType: "M&E area",
        remarks: null,
        functionalSpace: "Roof - green roof (access for maintenance only)",
        occupancyLoad: 0
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "roof garden | roof terrace",
        occupancyType: "single dwelling residential",
        remarks: null,
        functionalSpace: "Roof garden/roof terrace, private (of individual residential unit)",
        occupancyLoad: 0
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "roof garden | roof terrace",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Roof garden/roof terrace, private (of individual residential unit)",
        occupancyLoad: 0
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "jogging track",
        occupancyType: "sky garden/ terrace",
        remarks: null,
        functionalSpace: "Roof garden/roof terrace, public - jogging track/designated foot path <=3m in width",
        occupancyLoad: 3
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "footpath",
        occupancyType: "sky garden/ terrace",
        remarks: null,
        functionalSpace: "Roof garden/roof terrace, public - jogging track/designated foot path <=3m in width",
        occupancyLoad: 3
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "any",
        occupancyType: "sky garden/ terrace",
        remarks: "All planter boxes will be modelled as object (URA)\nQP to declare if it is fully covered > by default is not fully covered\n\nIfcFurniture.PLANTERBOX\nBIM components to be modelled in space\n\nFulllyCoveredWithTreesShrub [Boolean] = FALSE",
        functionalSpace: "Roof garden/roof terrace, public - planter box <300mm high",
        occupancyLoad: 1.5
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "any",
        occupancyType: "sky garden/ terrace",
        remarks: "All planter boxes will be modelled as object (URA)\nQP to declare if it is fully covered > by default is not fully covered\n\nIfcFurniture.PLANTERBOX\nBIM components to be modelled in space\n\nFulllyCoveredWithTreesShrub [Boolean] = TRUE",
        functionalSpace: "Roof garden/roof terrace, public - planter box =>300mm & <= 500mm high & covered fully with trees/shrubs",
        occupancyLoad: 0
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "any",
        occupancyType: "sky garden/ terrace",
        remarks: "All planter boxes will be modelled as object (URA)\nQP to declare if it is fully covered > by default is not fully covered\n\nIfcFurniture.PLANTERBOX\nBIM components to be modelled in space\n\nFulllyCoveredWithTreesShrub [Boolean] = FALSE",
        functionalSpace: "Roof garden/roof terrace, public - planter box =>300mm & <= 500mm high & not covered fully with trees/shrubs",
        occupancyLoad: 1.5
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "any",
        occupancyType: "sky garden/ terrace",
        remarks: "BIM components to be modelled in space\nIfcFurniture.PLANTERBOX\n\nStepRampAccess [Boolean] = FALSE",
        functionalSpace: "Roof garden/roof terrace, public - planter box >500mm high without step/ramp access",
        occupancyLoad: 0
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "any",
        occupancyType: "sky garden/ terrace",
        remarks: "BIM components to be modelled in space\nIfcFurniture.PLANTERBOX\n\nStepRampAccess [Boolean] = TRUE",
        functionalSpace: "Roof garden/roof terrace, public - planter box >500mm high with step/ramp access",
        occupancyLoad: 1.5
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "any",
        occupancyType: "sky garden/ terrace",
        remarks: "Water features typically modelled as a floor slab\n\nBIM components to be modelled in space\nIfcGeographicElement.WATERFEATURE",
        functionalSpace: "Roof garden/roof terrace, public - water feature <300mm in depth/height",
        occupancyLoad: 3
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "any",
        occupancyType: "sky garden/ terrace",
        remarks: "Water features typically modelled as a floor slab\n\nBIM components to be modelled in space\nIfcGeographicElement.WATERFEATURE",
        functionalSpace: "Roof garden/roof terrace, public - water feature =>300mm in depth/height",
        occupancyLoad: 0
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "sunken planting area",
        occupancyType: "sky garden/ terrace",
        remarks: "QP to declare if it is fully covered > by default is not fully covered\nTo call out / alert if sunken planting area is not in roof garden/ roof terrace OccupancyType\n\nFulllyCoveredWithTreesShrub [Boolean] = TRUE",
        functionalSpace: "Roof garden/roof terrace, public - sunken planting area (fully covered with trees/shrubs)",
        occupancyLoad: 0
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "sunken planting area",
        occupancyType: "sky garden/ terrace",
        remarks: "QP to declare if it is fully covered > by default is not fully covered\nTo call out / alert if sunken planting area is not in roof garden/ roof terrace OccupancyType\n\nFulllyCoveredWithTreesShrub [Boolean] = FALSE",
        functionalSpace: "Roof garden/roof terrace, public - sunken planting area (turf)",
        occupancyLoad: 3
      },
      {
        category: "Open space/ Open-sided space",
        spaceName: "any",
        occupancyType: "sky garden/ terrace",
        remarks: null,
        functionalSpace: "Roof garden/roof terrace, public - other areas",
        occupancyLoad: 1.5
      },
      {
        category: "M&E spaces",
        spaceName: "battery room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Battery room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "cooling tower",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Cooling tower",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "equipment disinfection room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Disinfection room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "equipment washing bay",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Equipment washing bay",
        occupancyLoad: 10
      },
      {
        category: "M&E spaces",
        spaceName: "lubrication bay",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lubrication bay",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "pulley room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pulley room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "mechnical plant room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "ac plant room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - AC plant room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "ahu room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - AHU room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "boiler room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - boiler room (oil fired)",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "chiller room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - chiller room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "discharge valve room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - discharge valve room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "electric lift motor room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - electric lift motor room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "electrical room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - electrical room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "essential fan room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - essential fan room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "fire pump room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - fire pump room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "pumped sanitary system room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pumped sanitary system room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "pumped drainage system room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pumped drainage system room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "emergency room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - emergency generator room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "generator room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - generator room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "high voltage switch room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - high voltage switch room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "hydraulic lift motor room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - hydraulic lift motor room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "lift machine room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - lift machine room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "lift motor room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - lift motor room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "low voltage switch room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - low voltage switch room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "oil tank room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - oil tank room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "sprinkler tank room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - sprinkler tank room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "telecommunication room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - telecommunication/non-essential equipment room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "equipment room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - telecommunication/non-essential equipment room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "transformer room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - transformer room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "wet riser tank room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mechanical plant room - wet riser tank room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "server room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Server room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "vent room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Vent room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "potable water tank room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Potable water tank room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "NEWater tank room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "NEWater tank room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "hosereel tank room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Hosereel tank room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "non-potable water tank room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Non-potable water tank room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "hydrant tank room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Hydrant tank room",
        occupancyLoad: 30
      },
      {
        category: "M&E spaces",
        spaceName: "detention tank",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Detention tank",
        occupancyLoad: 0
      },
      {
        category: "M&E spaces",
        spaceName: "rainwater Harvesting tank",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Rainwater Harvesting tank",
        occupancyLoad: 0
      },
      {
        category: "M&E spaces",
        spaceName: "irrigation tank",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Irrigation tank",
        occupancyLoad: 0
      },
      {
        category: "M&E spaces",
        spaceName: "sprinkler tank",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Sprinkler tank",
        occupancyLoad: 0
      },
      {
        category: "Storage spaces",
        spaceName: "bin center",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Bin center",
        occupancyLoad: 30
      },
      {
        category: "Storage spaces",
        spaceName: "coldroom",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Coldroom",
        occupancyLoad: 30
      },
      {
        category: "Storage spaces",
        spaceName: "deposit room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Deposit/strong room",
        occupancyLoad: 30
      },
      {
        category: "Storage spaces",
        spaceName: "strong room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Deposit/strong room",
        occupancyLoad: 30
      },
      {
        category: "Storage spaces",
        spaceName: "mortuary",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Mortuary",
        occupancyLoad: 30
      },
      {
        category: "Storage spaces",
        spaceName: "storage",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Storage/store",
        occupancyLoad: 30
      },
      {
        category: "Storage spaces",
        spaceName: "storeroom",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Storage/store",
        occupancyLoad: 30
      },
      {
        category: "Storage spaces",
        spaceName: "warehouse",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Warehouse",
        occupancyLoad: 30
      },
      {
        category: "Commuter facilities",
        spaceName: "driveway",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Driveway",
        occupancyLoad: 30
      },
      {
        category: "Commuter facilities",
        spaceName: "garage",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Garage",
        occupancyLoad: 30
      },
      {
        category: "Commuter facilities",
        spaceName: "parking place",
        occupancyType: null,
        remarks: "ParkingType [Label] = bicycle",
        functionalSpace: "Parking area - bicycle",
        occupancyLoad: 30
      },
      {
        category: "Commuter facilities",
        spaceName: "parking place",
        occupancyType: null,
        remarks: "ParkingType [Label] = car",
        functionalSpace: "Parking area - car/lorry/bus",
        occupancyLoad: 30
      },
      {
        category: "Commuter facilities",
        spaceName: "parking place",
        occupancyType: null,
        remarks: "ParkingType [Label] = heavy vehicle",
        functionalSpace: "Parking area - car/lorry/bus",
        occupancyLoad: 30
      },
      {
        category: "Commuter facilities",
        spaceName: "parking place",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Parking area - handicap",
        occupancyLoad: 30
      },
      {
        category: "Commuter facilities",
        spaceName: "parking place",
        occupancyType: null,
        remarks: "ParkingType [Label] = motorcycle",
        functionalSpace: "Parking area - motorcycle",
        occupancyLoad: 30
      },
      {
        category: "Commuter facilities",
        spaceName: "vehicle washing bay",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Parking area - washing",
        occupancyLoad: 30
      },
      {
        category: "Commuter facilities",
        spaceName: "loading/unloading bay",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Loading/unloading area/bay/platform",
        occupancyLoad: "4 persons per bay"
      },
      {
        category: "Commuter facilities",
        spaceName: "loading/unloading area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Loading/unloading area/bay/platform",
        occupancyLoad: "4 persons per bay"
      },
      {
        category: "Commuter facilities",
        spaceName: "loading/unloading platform",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Loading/unloading area/bay/platform",
        occupancyLoad: "4 persons per bay"
      },
      {
        category: "Commuter facilities",
        spaceName: "alighting point",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Alighting/boarding point",
        occupancyLoad: 0
      },
      {
        category: "Commuter facilities",
        spaceName: "boarding point",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Alighting/boarding point",
        occupancyLoad: 0
      },
      {
        category: "Commuter facilities",
        spaceName: "drop off point",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Drop off point",
        occupancyLoad: 0
      },
      {
        category: "Commuter facilities",
        spaceName: "bus stop",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Bus stop",
        occupancyLoad: 0
      },
      {
        category: "Commuter facilities",
        spaceName: "taxi bay",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Taxi bay",
        occupancyLoad: 0
      },
      {
        category: "Commuter facilities",
        spaceName: "taxi shelter",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Taxi shelter",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "atrium",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Atrium floor",
        occupancyLoad: 3
      },
      {
        category: "Circulation",
        spaceName: "concourse",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Concourse",
        occupancyLoad: 3
      },
      {
        category: "Circulation",
        spaceName: "foyer",
        occupancyType: "transport terminal",
        remarks: null,
        functionalSpace: "Foyer - bus/airport/ferry terminal or station",
        occupancyLoad: 1.5
      },
      {
        category: "Circulation",
        spaceName: "passenger arrival area",
        occupancyType: "transport terminal",
        remarks: null,
        functionalSpace: "Passenger arrival/departure areas - bus/airport/ferry terminal or station",
        occupancyLoad: 1.5
      },
      {
        category: "Circulation",
        spaceName: "passenger departure area",
        occupancyType: "transport terminal",
        remarks: null,
        functionalSpace: "Passenger arrival/departure areas - bus/airport/ferry terminal or station",
        occupancyLoad: 1.5
      },
      {
        category: "Circulation",
        spaceName: "cargo lift lobby",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lobby - cargo/ goods lift lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "goods lift lobby",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lobby - cargo/ goods lift lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "common lobby",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lobby - common lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "evacuation lift lobby",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lobby - evacuation lift lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "fire lift lobby",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lobby - fire lift lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "passenger lift lobby",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lobby - passenger lift lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "protected lobby",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lobby - protected lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "smoke-free lobby",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lobby - smoke-free lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "service lift lobby",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lobby - service lift lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "private lift lobby",
        occupancyType: "multi-unit residential",
        remarks: null,
        functionalSpace: "Lobby - private lift lobby",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "clean room",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Clean room",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "equipment platform",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Equipment platform",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "linkway",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Linkway",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "pedestrian linkway",
        occupancyType: null,
        remarks: "check for spaces with commerical OT abutting linkways (PG 4, 5 7)",
        functionalSpace: "Pedestrian linkway - with commercial activities",
        occupancyLoad: 2
      },
      {
        category: "Circulation",
        spaceName: "pedestrian linkway",
        occupancyType: null,
        remarks: "check for spaces with commerical OT abutting linkways (PG 4, 5 7)",
        functionalSpace: "Pedestrian linkway - without commercial activities",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "elevated pedestrian linkway",
        occupancyType: null,
        remarks: "check for spaces with commerical OT abutting linkways (PG 4, 5 7)",
        functionalSpace: "Elevated pedestrian linkway - with commercial activities",
        occupancyLoad: 2
      },
      {
        category: "Circulation",
        spaceName: "elevated pedestrian linkway",
        occupancyType: null,
        remarks: "check for spaces with commerical OT abutting linkways (PG 4, 5 7)",
        functionalSpace: "Elevated pedestrian linkway - without commercial activities",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "underground pedestrian linkway",
        occupancyType: null,
        remarks: "check for spaces with commerical OT abutting linkways (PG 4, 5 7)",
        functionalSpace: "Underground pedestrian linkway - with commercial activities",
        occupancyLoad: 2
      },
      {
        category: "Circulation",
        spaceName: "elevated pedestrian linkway",
        occupancyType: null,
        remarks: "check for spaces with commerical OT abutting linkways (PG 4, 5 7)",
        functionalSpace: "Underground pedestrian linkway - without commercial activities",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "promenade",
        occupancyType: null,
        remarks: null,
        functionalSpace: "promenade",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "boardwalk",
        occupancyType: null,
        remarks: null,
        functionalSpace: "boardwalk",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "through-block link",
        occupancyType: null,
        remarks: null,
        functionalSpace: "through-block link",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "access aisle",
        occupancyType: null,
        remarks: null,
        functionalSpace: "access aisle",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "private corridor",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Corridor (Private)",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "corridor",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Corridor - common corridor",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "external corridor",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Corridor - external corridor",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "open walkway",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Walkway",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "covered walkway",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Walkway",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "footway",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Footway",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "pathway",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Pathway",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "veranda",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Veranda",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "void deck",
        occupancyType: null,
        remarks: null,
        functionalSpace: "void-deck",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "external exit staircase",
        occupancyType: null,
        remarks: "Type of staircase to be determined from IfcStaircase types\n\nBIM components to be modelled in space\nIfcStair",
        functionalSpace: "Exit - external circular staircase",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: null,
        occupancyType: null,
        remarks: "Type of staircase to be determined from IfcStaircase types\n\nBIM components to be modelled in space\nIfcStair",
        functionalSpace: "Exit - external exit staircase",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "external exit staircase",
        occupancyType: null,
        remarks: "Type of staircase to be determined from IfcStaircase types\n\nBIM components to be modelled in space\nIfcStair",
        functionalSpace: "Exit - external spiral staircase",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "internal exit staircase",
        occupancyType: null,
        remarks: "Type of staircase to be determined from IfcStaircase types\n\nBIM components to be modelled in space\nIfcStair",
        functionalSpace: "Exit - internal circular staircase",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "internal exit staircase",
        occupancyType: null,
        remarks: "Type of staircase to be determined from IfcStaircase types\n\nBIM components to be modelled in space\nIfcStair",
        functionalSpace: "Exit - internal exit staircase",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "internal exit staircase",
        occupancyType: null,
        remarks: "Type of staircase to be determined from IfcStaircase types\n\nBIM components to be modelled in space\nIfcStair",
        functionalSpace: "Exit - internal spiral staircase",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "internal scissor exit staircase",
        occupancyType: null,
        remarks: "Type of staircase to be determined from IfcStaircase types\n\nBIM components to be modelled in space\nIfcStair",
        functionalSpace: "Exit - scissor exit staircase",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "external scissor exit staircase",
        occupancyType: null,
        remarks: "Type of staircase to be determined from IfcStaircase types\n\nBIM components to be modelled in space\nIfcStair",
        functionalSpace: "Exit - scissor exit staircase",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "external exit passageway",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Exit - external exit passageway",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "internal exit passageway",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Exit - internal exit passageway",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "external exit ramp",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcRamp",
        functionalSpace: "Exit - external exit ramp",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "internal exit ramp",
        occupancyType: null,
        remarks: "BIM components to be modelled in space\nIfcRamp",
        functionalSpace: "Exit - internal exit ramp",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "staircase",
        occupancyType: null,
        remarks: "indicate hardwood via material",
        functionalSpace: "Staircase - hardwood staircase",
        occupancyLoad: 0
      },
      {
        category: "Circulation",
        spaceName: "staircase",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Staircase - access staircase",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "airlock",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Airlock",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "letter box",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Letter box",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "dry riser shaft",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Shaft - dry riser",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "electrical shaft",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Shaft - electrical",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "gas shaft",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Shaft - gas",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "ventilation shaft",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Shaft - ventilation",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "water shaft",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Shaft - water",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "wet riser shaft",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Shaft - wet riser",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "lift shaft",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Lift shaft",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "non-shelter",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Non-shelter",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "storey shelter",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Storey shelter",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "staircase storey shelter",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Staircase storey shelter",
        occupancyLoad: 0
      },
      {
        category: "Other Non-simultaneous spaces",
        spaceName: "rest area",
        occupancyType: null,
        remarks: null,
        functionalSpace: "Rest area",
        occupancyLoad: 0
      },
      {
        category: "OTHERS",
        spaceName: "airwell",
        occupancyType: null,
        remarks: null,
        functionalSpace: "-",
        occupancyLoad: "-"
      }
    ];
    occupancyType = [
      {
        occupancyType: "single dwelling residential",
        example: [
          "bungalow",
          "detached house",
          "semi-detached house",
          "terrace house"
        ],
        purposeGroupCode: "small residential",
        purposeGroupLabel: "detached, semi-detached & terrace house",
        buildingTypeCode: "E",
        buildingType: [
          "exempted"
        ]
      },
      {
        occupancyType: "multi-unit residential",
        example: [
          "apartment",
          "condominium",
          "flat",
          "maisonette",
          "studio apartment"
        ],
        purposeGroupCode: "other residential",
        purposeGroupLabel: "Block of flats/ maisonettes",
        buildingTypeCode: 1,
        buildingType: [
          "residential"
        ]
      },
      {
        occupancyType: "supervisory care facility",
        example: [
          "detention centre",
          "correction centre",
          "dementia centre",
          "psychiatric rehabilitation home",
          "rehabilitation centre",
          "home for the spastic",
          "children's home",
          "home for intellectually disabled",
          "pre/post-natal care centre",
          "welfare home",
          "orphanage",
          "voluntary children home",
          "boys'/ girls' home",
          "adult disability home",
          "sheltered home",
          "assisted living facility"
        ],
        purposeGroupCode: "institutional (supervisory care facility)",
        purposeGroupLabel: "healthcare facility (inpatient)",
        buildingTypeCode: 15,
        buildingType: [
          "hospitals",
          "health-care centres",
          "clinics",
          "nursing homes",
          "homes for the aged and welfare homes"
        ]
      },
      {
        occupancyType: "supervisory care facility (detention)",
        example: [
          "prison holding area",
          "police station holding area (with overnight stay)"
        ],
        purposeGroupCode: "institutional (supervisory care facility)",
        purposeGroupLabel: "healthcare facility (inpatient)",
        buildingTypeCode: 17,
        buildingType: [
          "worker dormitories"
        ]
      },
      {
        occupancyType: "nursing care facilities",
        example: [
          "convalescent home",
          "home for the aged",
          "hospice",
          "nursing home"
        ],
        purposeGroupCode: "institutional (nursing care facility)",
        purposeGroupLabel: "healthcare facility (inpatient)",
        buildingTypeCode: 15,
        buildingType: [
          "hospitals",
          "health-care centres",
          "clinics",
          "nursing homes",
          "homes for the aged and welfare homes"
        ]
      },
      {
        occupancyType: "hospital without A&E services",
        example: [
          "public hospital",
          "private hospital",
          "community hospital",
          "psychiatric hospital"
        ],
        purposeGroupCode: "institutional (hospital facility)",
        purposeGroupLabel: "healthcare facility (inpatient)",
        buildingTypeCode: 15,
        buildingType: [
          "hospitals",
          "health-care centres",
          "clinics",
          "nursing homes",
          "homes for the aged and welfare homes"
        ]
      },
      {
        occupancyType: "hospital with A&E services",
        example: [],
        purposeGroupCode: "institutional (hospital facility)",
        purposeGroupLabel: "healthcare facility (inpatient)",
        buildingTypeCode: 15,
        buildingType: [
          "hospitals",
          "health-care centres",
          "clinics",
          "nursing homes",
          "homes for the aged and welfare homes"
        ]
      },
      {
        occupancyType: "ambulatory care facility",
        example: [
          "aesthetic clinic",
          "endoscopy clinic",
          "non-mental rehabilitation day centre",
          "renal dialysis day centre located within a complex"
        ],
        purposeGroupCode: "institutional (ambulatory care facility)",
        purposeGroupLabel: "healthcare facility (outpatient)",
        buildingTypeCode: 4,
        buildingType: [
          "Shopping complexes and multi-purpose complexes"
        ]
      },
      {
        occupancyType: "ambulatory care facility (standalone)",
        example: [
          "standalone building consists of mainly ambulatory care facilities"
        ],
        purposeGroupCode: "institutional (ambulatory care facility)",
        purposeGroupLabel: "healthcare facility (outpatient)",
        buildingTypeCode: 15,
        buildingType: [
          "hospitals",
          "health-care centres",
          "clinics",
          "nursing homes",
          "homes for the aged and welfare homes"
        ]
      },
      {
        occupancyType: "custodian care facility",
        example: [
          "mental rehabilitation day care centre",
          "daycare centre",
          "mentally/ intellectually disabled day care centre",
          "senior activity centre",
          "senior care centre",
          "school for the spastic",
          "psychiatric day care centre"
        ],
        purposeGroupCode: "institutional (custodian care facility)",
        purposeGroupLabel: "healthcare facility (outpatient)",
        buildingTypeCode: 15,
        buildingType: [
          "hospitals",
          "health-care centres",
          "clinics",
          "nursing homes",
          "homes for the aged and welfare homes"
        ]
      },
      {
        occupancyType: "custodian care facility (nursery)",
        example: [
          "childcare day centre",
          "infant-care day centre",
          "kindergarten for childer under 6 years of age"
        ],
        purposeGroupCode: "institutional (custodian care facility)",
        purposeGroupLabel: "healthcare facility (outpatient)",
        buildingTypeCode: 13,
        buildingType: [
          "pre-schools",
          "schools",
          "colleges",
          "universities and institutions of learning"
        ]
      },
      {
        occupancyType: "public education institution",
        example: [
          "public school",
          "training institution",
          "test centre"
        ],
        purposeGroupCode: "institutional (education/ training)",
        purposeGroupLabel: "schools & educational buildings",
        buildingTypeCode: 13,
        buildingType: [
          "pre-schools",
          "schools",
          "colleges",
          "universities and institutions of learning"
        ]
      },
      {
        occupancyType: "private education institution",
        example: [
          "tuition centre",
          "enrichment centre",
          "private school",
          "commercial school",
          "training institution"
        ],
        purposeGroupCode: "institutional (education/ training)",
        purposeGroupLabel: "schools & educational buildings",
        buildingTypeCode: 13,
        buildingType: [
          "pre-schools",
          "schools",
          "colleges",
          "universities and institutions of learning"
        ]
      },
      {
        occupancyType: "worker dormitory",
        example: [
          "workers' dormitry"
        ],
        purposeGroupCode: "institutional (worker lodging)",
        purposeGroupLabel: "Hotels, boarding houses, serviced apartments, hostels, backpacker hotel, dormitories",
        buildingTypeCode: 17,
        buildingType: [
          "worker dormitories"
        ]
      },
      {
        occupancyType: "office",
        example: [
          "bank",
          "stock broker",
          "telephone/ telegraph operating",
          "publisher",
          "insurance",
          "finance",
          "real estate",
          "advertising",
          "employment",
          "marketing",
          "embassy (administrative office)"
        ],
        purposeGroupCode: "office",
        purposeGroupLabel: "offices",
        buildingTypeCode: 3,
        buildingType: [
          "office building"
        ]
      },
      {
        occupancyType: "factory office",
        example: [
          "for factories/ utility/ warehouse buildings only"
        ],
        purposeGroupCode: "office",
        purposeGroupLabel: "offices",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "shop",
        example: [
          "beauty salon",
          "hairdressing salon",
          "book store",
          "Boutique",
          "confectionery outlet",
          "gift shop",
          "jwellery shop",
          "laundry",
          "laundromat",
          "pawnshop",
          "provisional shop",
          "ticketing agency",
          "travel agency",
          "drugstore",
          "pet clinic",
          "vet clinic",
          "pet hospital",
          "vet hospital",
          "animal hospital",
          "pet shop",
          "pet grooming",
          "pet boarding",
          "pet day care",
          "take-away food kiosk (small trade / business involving sale of goods",
          "retail",
          "service)",
          "showroom not located in warehouse/ factories"
        ],
        purposeGroupCode: "shop",
        purposeGroupLabel: "shop, healthcare facility (outpatient)",
        buildingTypeCode: 4,
        buildingType: [
          "Shopping complexes and multi-purpose complexes"
        ]
      },
      {
        occupancyType: "ODA",
        example: [
          "outdoor display area"
        ],
        purposeGroupCode: "shop",
        purposeGroupLabel: "shop, healthcare facility (outpatient)",
        buildingTypeCode: 4,
        buildingType: [
          "Shopping complexes and multi-purpose complexes"
        ]
      },
      {
        occupancyType: "outpatient clinic",
        example: [
          "for factories/ utility/ warehouse buildings only"
        ],
        purposeGroupCode: "shop",
        purposeGroupLabel: "shop, healthcare facility (outpatient)",
        buildingTypeCode: 4,
        buildingType: [
          "Shopping complexes and multi-purpose complexes"
        ]
      },
      {
        occupancyType: "polyclinic",
        example: [],
        purposeGroupCode: "shop",
        purposeGroupLabel: "shop, healthcare facility (outpatient)",
        buildingTypeCode: 15,
        buildingType: [
          "hospitals",
          "health-care centres",
          "clinics",
          "nursing homes",
          "homes for the aged and welfare homes"
        ]
      },
      {
        occupancyType: "market",
        example: [
          "wet market"
        ],
        purposeGroupCode: "shop",
        purposeGroupLabel: "shop, healthcare facility (outpatient)",
        buildingTypeCode: 11,
        buildingType: [
          "markets",
          "hawker or food centres"
        ]
      },
      {
        occupancyType: "Temporary showflat",
        example: [
          "standalone showflat"
        ],
        purposeGroupCode: "shop",
        purposeGroupLabel: "shop, healthcare facility (outpatient)",
        buildingTypeCode: "E",
        buildingType: [
          "exempted"
        ]
      },
      {
        occupancyType: "factory showroom",
        example: [
          "for factories/ utility buildings only"
        ],
        purposeGroupCode: "shop",
        purposeGroupLabel: "shop, healthcare facility (outpatient)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "petrol station",
        example: [],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: "E",
        buildingType: [
          "exempted"
        ]
      },
      {
        occupancyType: "factory",
        example: [
          "aircraft hangar",
          "chemicals",
          "consumable products",
          "data centre",
          "fireworks",
          "glassware",
          "metalwork",
          "highly combustible substances",
          "highly flammable products",
          "incineration",
          "oil refinery",
          "pharmaceutical",
          "rubber",
          "ship building",
          "telecommunication exchange",
          "vehicle repair",
          "woodwork"
        ],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "food production factory",
        example: [
          "central kitchen",
          "food production"
        ],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "M&E area",
        example: [
          "M&E area within a buidling"
        ],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: "E",
        buildingType: [
          "exempted"
        ]
      },
      {
        occupancyType: "wafer fabrication plant",
        example: [],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "trade effluent treatment plant",
        example: [
          "disinfection plant"
        ],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "waste management and recycling",
        example: [],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "embalming facility",
        example: [],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "agriculture",
        example: [
          "farm",
          "plant nursery (no visitor area)"
        ],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "animal related facility",
        example: [
          "pet crematorium | animal shelter | quarantine facilities  (no visitor area)"
        ],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "high containment facility",
        example: [
          "containment lab of biosafety level 3 & 4"
        ],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "electrical & gas facility",
        example: [
          "power generation plants",
          "gas trasmission/ receiving station"
        ],
        purposeGroupCode: "factory",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: "E",
        buildingType: [
          "exempted"
        ]
      },
      {
        occupancyType: "road tunnel",
        example: [
          "underground road network"
        ],
        purposeGroupCode: "exempted",
        purposeGroupLabel: null,
        buildingTypeCode: "E",
        buildingType: [
          "exempted"
        ]
      },
      {
        occupancyType: "body treatment place",
        example: [
          "massage establishment",
          "foot reflexology",
          "spa",
          "gymnasium",
          "fitness centre"
        ],
        purposeGroupCode: "Place of public resort (body treatment)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 4,
        buildingType: [
          "Shopping complexes and multi-purpose complexes"
        ]
      },
      {
        occupancyType: "entertainment place",
        example: [
          "arcade",
          "computing gaming",
          "game machine area",
          "karaoke lounge",
          "night club",
          "casino"
        ],
        purposeGroupCode: "Place of public resort (entertainment)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 4,
        buildingType: [
          "Shopping complexes and multi-purpose complexes"
        ]
      },
      {
        occupancyType: "assembly place",
        example: [
          "Auditorium",
          "theatre",
          "concert hall"
        ],
        purposeGroupCode: "Place of public resort (entertainment)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 4,
        buildingType: [
          "Shopping complexes and multi-purpose complexes"
        ]
      },
      {
        occupancyType: "cinema",
        example: [
          "cinema"
        ],
        purposeGroupCode: "Place of public resort (entertainment)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 4,
        buildingType: [
          "Shopping complexes and multi-purpose complexes"
        ]
      },
      {
        occupancyType: "recreational place",
        example: [
          "bowling",
          "billiard",
          "snooker",
          "dart (leisure sport)",
          "indoor play park"
        ],
        purposeGroupCode: "Place of public resort (recreational)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 7,
        buildingType: [
          "Places of public resort"
        ]
      },
      {
        occupancyType: "sky garden/ terrace",
        example: [
          "garden/ terrace within a building",
          "not on-grade",
          "roof/ mid level",
          "exclude those in residential units"
        ],
        purposeGroupCode: "Place of public resort (recreational)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: "D",
        buildingType: [
          "follow dominant use"
        ]
      },
      {
        occupancyType: "F&B outlet",
        example: [
          "pub",
          "bar",
          "restaurant",
          "coffee shop",
          "caf\xE9"
        ],
        purposeGroupCode: "Place of public resort (F&B)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 10,
        buildingType: [
          "Restaurants and eating establishments"
        ]
      },
      {
        occupancyType: "Fast food outlet",
        example: [
          "fast food outlet queuing & dining area"
        ],
        purposeGroupCode: "Place of public resort (F&B)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 10,
        buildingType: [
          "Restaurants and eating establishments"
        ]
      },
      {
        occupancyType: "ORA",
        example: [
          "outdoor refreshment area"
        ],
        purposeGroupCode: "Place of public resort (F&B)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 10,
        buildingType: [
          "Restaurants and eating establishments"
        ]
      },
      {
        occupancyType: "food centre",
        example: [
          "food court",
          "hawker centre",
          "canteen"
        ],
        purposeGroupCode: "Place of public resort (F&B)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 11,
        buildingType: [
          "markets",
          "hawker or food centres"
        ]
      },
      {
        occupancyType: "educational place",
        example: [
          "museum",
          "exhibition centre",
          "convention centre",
          "art centre",
          "gallery",
          "library"
        ],
        purposeGroupCode: "Place of public resort (educational)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 7,
        buildingType: [
          "Places of public resort"
        ]
      },
      {
        occupancyType: "serviced apartment",
        example: [],
        purposeGroupCode: "Place of public resort (accommodation)",
        purposeGroupLabel: "Hotels, boarding houses, serviced apartments, hostels, backpacker hotel, dormitories",
        buildingTypeCode: 6,
        buildingType: [
          "Serviced apartments"
        ]
      },
      {
        occupancyType: "hostel",
        example: [
          "student hostel",
          "visitor hostel",
          "staff quarter"
        ],
        purposeGroupCode: "Place of public resort (accommodation)",
        purposeGroupLabel: "Hotels, boarding houses, serviced apartments, hostels, backpacker hotel, dormitories",
        buildingTypeCode: 14,
        buildingType: [
          "hostels",
          "halls of residence or dormitories"
        ]
      },
      {
        occupancyType: "hotel",
        example: [
          "hotel",
          "resort",
          "backpacker's hotel",
          "boarding house"
        ],
        purposeGroupCode: "Place of public resort (accommodation)",
        purposeGroupLabel: "Hotels, boarding houses, serviced apartments, hostels, backpacker hotel, dormitories",
        buildingTypeCode: 5,
        buildingType: [
          "Hotel",
          "boarding houses",
          "chalets and backpacker hotels"
        ]
      },
      {
        occupancyType: "capsule hotel",
        example: [],
        purposeGroupCode: "Place of public resort (accommodation)",
        purposeGroupLabel: "Hotels, boarding houses, serviced apartments, hostels, backpacker hotel, dormitories",
        buildingTypeCode: 5,
        buildingType: [
          "Hotel",
          "boarding houses",
          "chalets and backpacker hotels"
        ]
      },
      {
        occupancyType: "community club",
        example: [],
        purposeGroupCode: "Place of public resort (social)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 7,
        buildingType: [
          "Places of public resort"
        ]
      },
      {
        occupancyType: "social club",
        example: [
          "private club",
          "association"
        ],
        purposeGroupCode: "Place of public resort (social)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 7,
        buildingType: [
          "Places of public resort"
        ]
      },
      {
        occupancyType: "religious place",
        example: [
          "church",
          "mosque",
          "temple",
          "synagogue",
          "funeral parlour",
          "columbarium",
          "crematorium visitor area"
        ],
        purposeGroupCode: "Place of public resort (religious)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 7,
        buildingType: [
          "Places of public resort"
        ]
      },
      {
        occupancyType: "park",
        example: [
          "on-grade park",
          "playground",
          "not part or surrounded by building"
        ],
        purposeGroupCode: "exempted",
        purposeGroupLabel: null,
        buildingTypeCode: 8,
        buildingType: [
          "Parks and open spaces including zoos",
          "civic plazas",
          "etc"
        ]
      },
      {
        occupancyType: "sports facility",
        example: [
          "public sport complex",
          "public swimming complex",
          "swimming complex",
          "stadium",
          "indoor sports hall"
        ],
        purposeGroupCode: "Place of public resort (recreational)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 9,
        buildingType: [
          "Sports complexes and public swimming pools"
        ]
      },
      {
        occupancyType: "sports facility (ancillary)",
        example: [
          "sports facilities within a school"
        ],
        purposeGroupCode: "Place of public resort (recreational)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: "D",
        buildingType: [
          "follow dominant use"
        ]
      },
      {
        occupancyType: "train station",
        example: [
          "rapid transit system"
        ],
        purposeGroupCode: "Place of public resort (transportation)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 12,
        buildingType: [
          "transport stations",
          "interchanges",
          "and passenger terminals"
        ]
      },
      {
        occupancyType: "transport terminal",
        example: [
          "bus interchange",
          "bus terminal",
          "airport terminal",
          "ferry terminal"
        ],
        purposeGroupCode: "Place of public resort (transportation)",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 12,
        buildingType: [
          "transport stations",
          "interchanges",
          "and passenger terminals"
        ]
      },
      {
        occupancyType: "transport depot",
        example: [
          "rail depot",
          "bus depot"
        ],
        purposeGroupCode: "storage",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "Parking",
        example: [
          "vehicle park (non mechanised)"
        ],
        purposeGroupCode: "storage",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 18,
        buildingType: [
          "vehicle parks"
        ]
      },
      {
        occupancyType: "FAMCP",
        example: [
          "fully automated mechanised carpark"
        ],
        purposeGroupCode: "storage",
        purposeGroupLabel: "Places of public resort & carpark",
        buildingTypeCode: 18,
        buildingType: [
          "vehicle parks"
        ]
      },
      {
        occupancyType: "warehouse",
        example: [],
        purposeGroupCode: "storage",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "chemical/ hazmat storage",
        example: [],
        purposeGroupCode: "storage",
        purposeGroupLabel: "industrial buildings (factories, workshops, godown/ warehouse)",
        buildingTypeCode: 16,
        buildingType: [
          "factories",
          "workshops",
          "industrial buildings and office/ showroom areas in warehouses"
        ]
      },
      {
        occupancyType: "airbase | live firing area | training area",
        example: [],
        purposeGroupCode: "exempted",
        purposeGroupLabel: null,
        buildingTypeCode: "E",
        buildingType: [
          "exempted"
        ]
      },
      {
        occupancyType: "campsite | wet play field",
        example: [],
        purposeGroupCode: "exempted",
        purposeGroupLabel: null,
        buildingTypeCode: 8,
        buildingType: [
          "parks and open spaces"
        ]
      },
      {
        occupancyType: "reservoir | river | canal | major drain | pond | lake | other waterbody",
        example: [],
        purposeGroupCode: "exempted",
        purposeGroupLabel: null,
        buildingTypeCode: 8,
        buildingType: [
          "parks and open spaces"
        ]
      },
      {
        occupancyType: "nature reserve | nature area | school field | pedestrian mall / footpath | promenade | quarry | marina",
        example: [],
        purposeGroupCode: "exempted",
        purposeGroupLabel: null,
        buildingTypeCode: 8,
        buildingType: [
          "parks and open spaces"
        ]
      }
    ];
    projectDevelopmentType = [
      "Residential (landed)",
      "Residential (non-landed)",
      "Mixed development",
      "Commercial",
      "Industrial",
      "Healthcare",
      "Institutional",
      "Agriculture",
      "Transport stations",
      "Civil engineering works / Infrastructure",
      "Free-standing structures",
      "Others"
    ];
    spaceNameJson = {
      spaceName,
      occupancyType,
      projectDevelopmentType
    };
  }
});

// .svelte-kit/output/server/entries/pages/(main)/spacename/_layout.svelte.js
var layout_svelte_exports5 = {};
__export(layout_svelte_exports5, {
  default: () => Layout5
});
function mutateData(data) {
  const categories = [...new Set(data.map((x) => x.category.replace(/\n/, "")))];
  return categories;
}
var css$16, Sidebar, css9, Layout5;
var init_layout_svelte5 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/spacename/_layout.svelte.js"() {
    init_ssr();
    init_functions();
    init_helper2();
    init_data_space_ot_pdt();
    css$16 = {
      code: ".container.svelte-7hjcee.svelte-7hjcee{display:flex;flex-direction:column;padding-top:1rem;height:100%;padding-inline:1rem 0.5rem}.inputBox.svelte-7hjcee.svelte-7hjcee{display:grid;grid-template-columns:auto auto;width:100%;margin-block:0.5rem}.inputBox.svelte-7hjcee input.svelte-7hjcee{min-width:0}.scrollable.svelte-7hjcee.svelte-7hjcee{display:flex;flex-direction:column;gap:0.5rem;overflow-y:auto;padding-bottom:6rem}.scrollable.svelte-7hjcee .row.svelte-7hjcee{background-color:var(--bg-s);border-radius:0.5rem}.scrollable.svelte-7hjcee .row.svelte-7hjcee:hover{background-color:var(--bg-alt)}.scrollable.svelte-7hjcee .row.selected.svelte-7hjcee{background-color:var(--bg-alt)}.scrollable.svelte-7hjcee .row.selected a.svelte-7hjcee{color:var(--url)}.scrollable.svelte-7hjcee .row a.svelte-7hjcee{text-decoration:none;display:flex;font-size:0.875rem;width:100%;justify-content:space-between;align-items:center;padding:0.5rem;color:var(--main)}.scrollable.svelte-7hjcee .row a.svelte-7hjcee:hover{color:var(--url)}",
      map: null
    };
    Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { data } = $$props;
      createEventDispatcher();
      const list_original = mutateData(data);
      let list = list_original;
      let input, searchString;
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css$16);
      return ` <div class="container svelte-7hjcee"><div class="inputBox svelte-7hjcee"><input class="placeholder-smaller svelte-7hjcee" type="text" placeholder="Search spaces category"${add_attribute("this", input, 0)}${add_attribute("value", searchString, 0)}> <div class="kbs" data-svelte-h="svelte-1cs8p2x"><code>Ctrl</code> <code>E</code></div></div> <div class="scrollable svelte-7hjcee">${each(list, (category) => {
        return `<div class="${["row svelte-7hjcee", ""].join(" ").trim()}"><a href="${"/spacename/" + escape(category.replace(/[\/,]/g, "").replace(/\s+/g, "-").toLowerCase(), true)}" class="svelte-7hjcee">${escape(category)}</a> </div>`;
      })}</div> </div>`;
    });
    css9 = {
      code: ".sidebar.svelte-1a74clh{position:sticky;overflow-y:auto;border-right:1px solid var(--grey-lighter)}.content.svelte-1a74clh{padding-top:2rem;margin-inline:auto;width:100%;max-width:min(100vw - 300px, 1300px);min-height:calc(100vh - 70px);padding-bottom:100px;padding:2rem}",
      map: null
    };
    Layout5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      const spaces = spaceNameJson.spaceName;
      $$result.css.add(css9);
      return `<div class="sidebar svelte-1a74clh">${validate_component(Sidebar, "Sidebar").$$render($$result, { data: spaces }, {}, {})}</div> <div class="content svelte-1a74clh">${slots.default ? slots.default({}) : ``} </div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/5.js
var __exports6 = {};
__export(__exports6, {
  component: () => component6,
  fonts: () => fonts6,
  imports: () => imports6,
  index: () => index6,
  stylesheets: () => stylesheets6
});
var index6, component_cache6, component6, imports6, stylesheets6, fonts6;
var init__6 = __esm({
  ".svelte-kit/output/server/nodes/5.js"() {
    index6 = 5;
    component6 = async () => component_cache6 ?? (component_cache6 = (await Promise.resolve().then(() => (init_layout_svelte5(), layout_svelte_exports5))).default);
    imports6 = ["_app/immutable/nodes/5.9849034e.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/helper.a19e06e9.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/preload-helper.a4192956.js", "_app/immutable/chunks/paths.3682a10a.js", "_app/immutable/chunks/data_space_ot_pdt.64972bc5.js"];
    stylesheets6 = ["_app/immutable/assets/5.34159b4b.css"];
    fonts6 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(admin)/admin/_page.svelte.js
var page_svelte_exports = {};
__export(page_svelte_exports, {
  default: () => Page
});
var css10, Page;
var init_page_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/(admin)/admin/_page.svelte.js"() {
    init_ssr();
    css10 = {
      code: ".row.svelte-1lp8d3c.svelte-1lp8d3c{display:grid;grid-template-columns:repeat(4, 1fr);gap:3rem}.card.svelte-1lp8d3c.svelte-1lp8d3c{background-color:var(--bg-s);height:400px;border-radius:0.5rem;padding:2rem;display:flex;flex-direction:column;gap:1rem}.card.card__entity.svelte-1lp8d3c.svelte-1lp8d3c{font-size:1rem}.card.card__entity.svelte-1lp8d3c ul.svelte-1lp8d3c{margin:0;padding:0}.card.card__entity.svelte-1lp8d3c ul li.svelte-1lp8d3c{margin:0;padding:0;padding-block:0.25rem;list-style-type:none}",
      map: null
    };
    Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css10);
      return `<h1 data-svelte-h="svelte-h1rq17">ADMIN PORTAL</h1> <div class="dashboard"><div class="row svelte-1lp8d3c">${``} <div class="card svelte-1lp8d3c"></div> <div class="card svelte-1lp8d3c"></div> <div class="card svelte-1lp8d3c"></div></div> </div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/6.js
var __exports7 = {};
__export(__exports7, {
  component: () => component7,
  fonts: () => fonts7,
  imports: () => imports7,
  index: () => index7,
  stylesheets: () => stylesheets7
});
var index7, component_cache7, component7, imports7, stylesheets7, fonts7;
var init__7 = __esm({
  ".svelte-kit/output/server/nodes/6.js"() {
    index7 = 6;
    component7 = async () => component_cache7 ?? (component_cache7 = (await Promise.resolve().then(() => (init_page_svelte(), page_svelte_exports))).default);
    imports7 = ["_app/immutable/nodes/6.a78611a9.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/index.1043141f.js"];
    stylesheets7 = ["_app/immutable/assets/6.54ec9b8e.css"];
    fonts7 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(admin)/admin/users/_page.server.js
var page_server_exports = {};
__export(page_server_exports, {
  load: () => load6
});
async function load6({ locals, url }) {
  const session2 = await locals.getSession();
  if (!session2) {
    throw redirect(307, `/login?redirect=${url.pathname.replace("/", "")}`);
  }
  const supabase2 = locals.supabase;
  const { data: { users }, error: error2 } = await supabase2.auth.admin.listUsers({
    page: 1,
    perPage: 1e3
  });
  if (session2.user.user_metadata.role == "manager") {
    const filtered = users.filter((x) => {
      if (x.user_metadata.referral == session2.user.email) {
        return x;
      }
      if (x.id == session2.user.id) {
        return x;
      }
    });
    console.log(filtered);
    return { users: filtered };
  }
  return { users };
}
var init_page_server = __esm({
  ".svelte-kit/output/server/entries/pages/(admin)/admin/users/_page.server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/chunks/Modal.js
var css11, Modal;
var init_Modal = __esm({
  ".svelte-kit/output/server/chunks/Modal.js"() {
    init_ssr();
    init_Icon();
    css11 = {
      code: ".modal_background.svelte-h7x0vf.svelte-h7x0vf{position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;justify-content:center;align-items:center;z-index:100;background:color-mix(in srgb, var(--mono-100) 75%, transparent);backdrop-filter:blur(4px)}button.svelte-h7x0vf.svelte-h7x0vf{background-color:transparent !important;border:none;outline:none;color:var(--main)}.modal_close.svelte-h7x0vf.svelte-h7x0vf{position:absolute;top:0rem;right:0rem;cursor:pointer;display:flex;height:36px;width:36px;margin:0.5rem;padding:0.5rem;border-radius:50px;display:flex;align-items:center;justify-content:center}.modal_close.svelte-h7x0vf svg{flex-shrink:0}.modal_close.svelte-h7x0vf.svelte-h7x0vf:hover{background-color:var(--mono-500)}.modal_close.topright.svelte-h7x0vf.svelte-h7x0vf{margin:1.5rem;width:42px;height:42px}.modal.svelte-h7x0vf.svelte-h7x0vf{z-index:101;position:absolute;overflow:auto;max-height:calc(100vh - 4em);min-width:250px;width:fit-content;max-width:80vw;background-color:var(--background-primary);border-radius:1rem}.modal.noStyle.svelte-h7x0vf.svelte-h7x0vf{padding:1rem}.modal[modal_position=top].svelte-h7x0vf.svelte-h7x0vf{top:5rem}.modal.svelte-h7x0vf .slot.svelte-h7x0vf{min-width:250px;min-height:100px;padding:2rem}",
      map: null
    };
    Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let modal;
      let { show = false } = $$props;
      let { closeButton = true } = $$props;
      let { closePosition = "modal" } = $$props;
      let { modalPosition = "center" } = $$props;
      let { escape: escape2 = true } = $$props;
      let { exitOutsideClick = true } = $$props;
      let { exitWithEscapeKey = true } = $$props;
      let { modalStyle = true } = $$props;
      const dispatch = createEventDispatcher();
      function closeFromChild() {
        close();
      }
      function open() {
        show = true;
        document.body.style.overflowY = "hidden";
      }
      function close() {
        show = false;
        document.body.style.overflowY = "auto";
        dispatch("close");
      }
      if ($$props.show === void 0 && $$bindings.show && show !== void 0)
        $$bindings.show(show);
      if ($$props.closeButton === void 0 && $$bindings.closeButton && closeButton !== void 0)
        $$bindings.closeButton(closeButton);
      if ($$props.closePosition === void 0 && $$bindings.closePosition && closePosition !== void 0)
        $$bindings.closePosition(closePosition);
      if ($$props.modalPosition === void 0 && $$bindings.modalPosition && modalPosition !== void 0)
        $$bindings.modalPosition(modalPosition);
      if ($$props.escape === void 0 && $$bindings.escape && escape2 !== void 0)
        $$bindings.escape(escape2);
      if ($$props.exitOutsideClick === void 0 && $$bindings.exitOutsideClick && exitOutsideClick !== void 0)
        $$bindings.exitOutsideClick(exitOutsideClick);
      if ($$props.exitWithEscapeKey === void 0 && $$bindings.exitWithEscapeKey && exitWithEscapeKey !== void 0)
        $$bindings.exitWithEscapeKey(exitWithEscapeKey);
      if ($$props.modalStyle === void 0 && $$bindings.modalStyle && modalStyle !== void 0)
        $$bindings.modalStyle(modalStyle);
      if ($$props.open === void 0 && $$bindings.open && open !== void 0)
        $$bindings.open(open);
      if ($$props.close === void 0 && $$bindings.close && close !== void 0)
        $$bindings.close(close);
      $$result.css.add(css11);
      return ` ${show ? `  <div aria-modal="true" class="modal_background svelte-h7x0vf"${add_attribute("this", modal, 0)}>${closeButton ? `${closePosition == "background" ? `<button class="modal_close topright svelte-h7x0vf">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "material-symbols:close",
          width: "42",
          inline: true
        },
        {},
        {}
      )}</button>` : ``}` : ``} <div class="${["modal svelte-h7x0vf", !modalStyle ? "noStyle" : ""].join(" ").trim()}"${add_attribute("modal_position", modalPosition, 0)} role="dialog" aria-modal="true">${closeButton ? `${closePosition == "modal" ? `<button class="modal_close svelte-h7x0vf">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "material-symbols:close",
          width: "24",
          inline: true
        },
        {},
        {}
      )}</button>` : ``}` : ``} <div class="${["svelte-h7x0vf", modalStyle ? "slot" : ""].join(" ").trim()}">${slots.default ? slots.default({ closeFromChild }) : ``}</div></div></div>` : ``}`;
    });
  }
});

// node_modules/.pnpm/dayjs@1.11.9/node_modules/dayjs/dayjs.min.js
var require_dayjs_min = __commonJS({
  "node_modules/.pnpm/dayjs@1.11.9/node_modules/dayjs/dayjs.min.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
    }(exports, function() {
      "use strict";
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s2 = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date())
          return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s3 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s3 ? -1 : 1), c);
        return +(-(r2 + (n2 - i2) / (s3 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h, w: o, d: a, D: d, h: u, m: s2, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D = {};
      D[g] = M;
      var p = function(t2) {
        return t2 instanceof b;
      }, S = function t2(e2, n2, r2) {
        var i2;
        if (!e2)
          return g;
        if ("string" == typeof e2) {
          var s3 = e2.toLowerCase();
          D[s3] && (i2 = s3), n2 && (D[s3] = n2, i2 = s3);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1)
            return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (g = i2), i2 || !r2 && g;
      }, w = function(t2, e2) {
        if (p(t2))
          return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new b(n2);
      }, O = v;
      O.l = S, O.i = p, O.w = function(t2, e2) {
        return w(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var b = function() {
        function M2(t2) {
          this.$L = S(t2.locale, null, true), this.parse(t2);
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2)
              return /* @__PURE__ */ new Date(NaN);
            if (O.u(e2))
              return /* @__PURE__ */ new Date();
            if (e2 instanceof Date)
              return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match($);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s3 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s3)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s3);
              }
            }
            return new Date(e2);
          }(t2), this.$x = t2.x || {}, this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return O;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = w(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return w(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < w(t2);
        }, m2.$g = function(t2, e2, n2) {
          return O.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!O.u(e2) || e2, f2 = O.p(t2), l2 = function(t3, e3) {
            var i2 = O.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, $2 = function(t3, e3) {
            return O.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (f2) {
            case h:
              return r2 ? l2(1, 0) : l2(31, 11);
            case c:
              return r2 ? l2(1, M3) : l2(0, M3 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s2:
              return $2(v2 + "Seconds", 2);
            case i:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = O.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s2] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else
            l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[O.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $2 = O.p(f2), y2 = function(t2) {
            var e2 = w(l2);
            return O.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($2 === c)
            return this.set(c, this.$M + r2);
          if ($2 === h)
            return this.set(h, this.$y + r2);
          if ($2 === a)
            return y2(1);
          if ($2 === o)
            return y2(7);
          var M3 = (d2 = {}, d2[s2] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return O.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid())
            return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = O.z(this), s3 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s4) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s4);
          }, d2 = function(t3) {
            return O.s(s3 % 12 || 12, t3, "0");
          }, $2 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r2.replace(y, function(t3, r3) {
            return r3 || function(t4) {
              switch (t4) {
                case "YY":
                  return String(e2.$y).slice(-2);
                case "YYYY":
                  return O.s(e2.$y, 4, "0");
                case "M":
                  return a2 + 1;
                case "MM":
                  return O.s(a2 + 1, 2, "0");
                case "MMM":
                  return h2(n2.monthsShort, a2, c2, 3);
                case "MMMM":
                  return h2(c2, a2);
                case "D":
                  return e2.$D;
                case "DD":
                  return O.s(e2.$D, 2, "0");
                case "d":
                  return String(e2.$W);
                case "dd":
                  return h2(n2.weekdaysMin, e2.$W, o2, 2);
                case "ddd":
                  return h2(n2.weekdaysShort, e2.$W, o2, 3);
                case "dddd":
                  return o2[e2.$W];
                case "H":
                  return String(s3);
                case "HH":
                  return O.s(s3, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $2(s3, u2, true);
                case "A":
                  return $2(s3, u2, false);
                case "m":
                  return String(u2);
                case "mm":
                  return O.s(u2, 2, "0");
                case "s":
                  return String(e2.$s);
                case "ss":
                  return O.s(e2.$s, 2, "0");
                case "SSS":
                  return O.s(e2.$ms, 3, "0");
                case "Z":
                  return i2;
              }
              return null;
            }(t3) || i2.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $2, y2 = this, M3 = O.p(d2), m3 = w(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
            return O.m(y2, m3);
          };
          switch (M3) {
            case h:
              $2 = D2() / 12;
              break;
            case c:
              $2 = D2();
              break;
            case f:
              $2 = D2() / 3;
              break;
            case o:
              $2 = (g2 - v2) / 6048e5;
              break;
            case a:
              $2 = (g2 - v2) / 864e5;
              break;
            case u:
              $2 = g2 / n;
              break;
            case s2:
              $2 = g2 / e;
              break;
            case i:
              $2 = g2 / t;
              break;
            default:
              $2 = g2;
          }
          return l2 ? $2 : O.a($2);
        }, m2.daysInMonth = function() {
          return this.endOf(c).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2)
            return this.$L;
          var n2 = this.clone(), r2 = S(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return O.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      }(), _ = b.prototype;
      return w.prototype = _, [["$ms", r], ["$s", i], ["$m", s2], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
        _[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), w.extend = function(t2, e2) {
        return t2.$i || (t2(e2, b, w), t2.$i = true), w;
      }, w.locale = S, w.isDayjs = p, w.unix = function(t2) {
        return w(1e3 * t2);
      }, w.en = D[g], w.Ls = D, w.p = {}, w;
    });
  }
});

// .svelte-kit/output/server/entries/pages/(admin)/admin/users/_page.svelte.js
var page_svelte_exports2 = {};
__export(page_svelte_exports2, {
  default: () => Page2
});
var import_dayjs, roleOperations, css12, Page2;
var init_page_svelte2 = __esm({
  ".svelte-kit/output/server/entries/pages/(admin)/admin/users/_page.svelte.js"() {
    init_ssr();
    init_Icon();
    init_theme_store();
    init_Modal();
    init_helper2();
    import_dayjs = __toESM(require_dayjs_min(), 1);
    roleOperations = [
      {
        operation: "Read all front-end content",
        roles: [
          "reader",
          "manager",
          "editor",
          "admin",
          "owner"
        ]
      },
      {
        operation: "Edit content",
        roles: [
          "editor",
          "admin",
          "owner"
        ]
      },
      {
        operation: "Invite user, manage invited users",
        roles: [
          "manager",
          "admin",
          "owner"
        ]
      },
      {
        operation: "Manage all users and roles",
        roles: [
          "admin",
          "owner"
        ]
      }
    ];
    css12 = {
      code: 'h1.svelte-wnpgdq.svelte-wnpgdq.svelte-wnpgdq{margin:0}table.users.svelte-wnpgdq th.svelte-wnpgdq.svelte-wnpgdq{text-align:left}table.users.svelte-wnpgdq td.svelte-wnpgdq>div.svelte-wnpgdq{padding-block:0.5rem;width:inherit;white-space:nowrap;display:block;overflow:hidden;text-overflow:ellipsis;font-size:0.875rem}table.users.svelte-wnpgdq td.svelte-wnpgdq.svelte-wnpgdq:first-child{width:200px}table.users.svelte-wnpgdq td.svelte-wnpgdq.svelte-wnpgdq:nth-child(2){width:200px}table.users.svelte-wnpgdq td.svelte-wnpgdq.svelte-wnpgdq:nth-child(3){width:100px}table.users.svelte-wnpgdq td.svelte-wnpgdq.svelte-wnpgdq:nth-child(4){width:150px}table.users.svelte-wnpgdq td.svelte-wnpgdq.svelte-wnpgdq:nth-child(5),table.users.svelte-wnpgdq td.svelte-wnpgdq.svelte-wnpgdq:nth-child(6){width:180px}table.users.svelte-wnpgdq td.svelte-wnpgdq:nth-child(5)>div.svelte-wnpgdq,table.users.svelte-wnpgdq td.svelte-wnpgdq:nth-child(6)>div.svelte-wnpgdq{font-size:0.875rem;color:var(--mono-400)}table.users td:nth-child(5)>div.svelte-wnpgdq .pending.svelte-wnpgdq.svelte-wnpgdq,table.users td:nth-child(6)>div.svelte-wnpgdq .pending.svelte-wnpgdq.svelte-wnpgdq{width:fit-content;padding:0.25rem 0.5rem;border-radius:0.5rem;border:1px solid orange;color:var(--orange-text);background-color:color-mix(in srgb, var(--orange) 12%, transparent)}table.users.svelte-wnpgdq td.svelte-wnpgdq.svelte-wnpgdq:nth-child(7){width:100px}table.users.svelte-wnpgdq td:nth-child(7) div.svelte-wnpgdq.svelte-wnpgdq{width:inherit}table.users.svelte-wnpgdq td:nth-child(7) div.svelte-wnpgdq span.svelte-wnpgdq{font-family:"Fira Code", monospace;color:var(--mono-400);width:90px;padding-right:2px;white-space:nowrap;display:block;overflow:hidden;text-overflow:ellipsis;font-size:0.875rem}table.users.svelte-wnpgdq td.svelte-wnpgdq.svelte-wnpgdq:last-child{width:36px}table.users.svelte-wnpgdq .table__data__more.svelte-wnpgdq.svelte-wnpgdq{border:0;padding:0.125rem 0.5rem;height:fit-content;align-items:center;display:flex}table.users.svelte-wnpgdq .table__data__more__menu.svelte-wnpgdq.svelte-wnpgdq{display:flex;flex-direction:column;gap:0;border:1px solid var(--mono-200);background-color:var(--bg-alt);border-radius:0.25rem;padding:0;padding-block:0.25rem}table.users.svelte-wnpgdq .table__data__more__menu button.svelte-wnpgdq.svelte-wnpgdq{width:100%;justify-content:flex-start;padding:0.25rem;font-size:0.875rem;padding:0.5rem 1rem;border-radius:0}table.users.svelte-wnpgdq .table__data_noResult.svelte-wnpgdq.svelte-wnpgdq{border-left:1px solid var(--mono-200);border-radius:0 0 0.25rem 0.25rem}table.users.svelte-wnpgdq .table__data_noResult.svelte-wnpgdq>div.svelte-wnpgdq{padding-block:1rem;width:100%;display:flex;color:var(--mono-400);align-items:center;font-size:0.875rem;gap:0.5rem}table.users.svelte-wnpgdq .table__data_noResult>div.svelte-wnpgdq .icon.svelte-wnpgdq{width:fit-content;display:flex}table.svelte-wnpgdq .banner.svelte-wnpgdq.svelte-wnpgdq{width:fit-content;padding:0.25rem 0.5rem;border-radius:0.5rem}table.svelte-wnpgdq .banner.orange.svelte-wnpgdq.svelte-wnpgdq{border:1px solid orange;color:var(--orange-text);background-color:color-mix(in srgb, var(--orange) 12%, transparent)}table.svelte-wnpgdq .banner.red.svelte-wnpgdq.svelte-wnpgdq{border:1px solid var(--red);color:var(--red);background-color:color-mix(in srgb, var(--red) 12%, transparent)}table.role.svelte-wnpgdq th.svelte-wnpgdq.svelte-wnpgdq,table.role.svelte-wnpgdq td.svelte-wnpgdq.svelte-wnpgdq{font-size:0.875rem}table.role.svelte-wnpgdq th.svelte-wnpgdq.svelte-wnpgdq:not(:first-child){text-align:center}table.role.svelte-wnpgdq td div.svelte-wnpgdq.svelte-wnpgdq{padding-block:0.25rem}table.role.svelte-wnpgdq td:not(:first-child) div.svelte-wnpgdq.svelte-wnpgdq{justify-content:center}.modal.svelte-wnpgdq.svelte-wnpgdq.svelte-wnpgdq{display:flex;flex-direction:column;gap:1rem;width:400px}.modal.svelte-wnpgdq h1.svelte-wnpgdq.svelte-wnpgdq{margin-top:0;margin-bottom:1rem;font-size:24px;position:relative;width:fit-content}.modal.svelte-wnpgdq h1.svelte-wnpgdq.svelte-wnpgdq:after{position:absolute;bottom:-0.5rem;left:0;content:"";width:100%;height:4px;background-color:var(--accent-500)}.modal.svelte-wnpgdq .info.svelte-wnpgdq.svelte-wnpgdq{color:var(--mono-500);font-size:0.875rem}.modal.svelte-wnpgdq div.error.svelte-wnpgdq.svelte-wnpgdq{display:flex;align-items:center;gap:0.25rem;color:var(--red);font-size:0.875rem}.modal.modal__editRole.svelte-wnpgdq.svelte-wnpgdq.svelte-wnpgdq{min-width:600px;min-height:400px}.modal.modal__createUser.svelte-wnpgdq .field.svelte-wnpgdq.svelte-wnpgdq{display:flex;flex-direction:column;gap:0.5rem}.modal.modal__createUser.svelte-wnpgdq .inputBox.svelte-wnpgdq.svelte-wnpgdq{gap:1rem}.modal.modal__createUser.svelte-wnpgdq button.svelte-wnpgdq.svelte-wnpgdq{margin-top:1rem;height:40px}.modal.modal__updatePassword.svelte-wnpgdq .inputBox.svelte-wnpgdq input.svelte-wnpgdq{width:100%}.modal.modal__updatePassword.svelte-wnpgdq .inputBox.svelte-wnpgdq .icon.svelte-wnpgdq{margin-left:auto}.modal.modal__deleteUser.svelte-wnpgdq span.svelte-wnpgdq.svelte-wnpgdq{color:var(--mono-800)}.modal.svelte-wnpgdq .buttonGroup.svelte-wnpgdq.svelte-wnpgdq{padding-top:1rem;margin-top:auto;display:flex;flex-direction:row-reverse;margin-right:auto;gap:0.5rem}.modal.svelte-wnpgdq .buttonGroup button.svelte-wnpgdq.svelte-wnpgdq{width:100px}.row.svelte-wnpgdq.svelte-wnpgdq.svelte-wnpgdq{padding-block:1rem 0.5rem;display:flex;justify-content:space-between}.row.svelte-wnpgdq .icon.svelte-wnpgdq.svelte-wnpgdq{display:flex;justify-content:center;align-items:center}.row.svelte-wnpgdq .inputBox.svelte-wnpgdq.svelte-wnpgdq{gap:0.5rem;width:300px}.row.svelte-wnpgdq .inputBox.svelte-wnpgdq .icon.svelte-wnpgdq{color:var(--mono-400)}.row.svelte-wnpgdq .inputBox.svelte-wnpgdq input.svelte-wnpgdq{padding-block:0.25rem;width:100%;font-size:0.875rem}.row.svelte-wnpgdq .inputBox .close.svelte-wnpgdq.svelte-wnpgdq{margin-left:auto}.row.svelte-wnpgdq .buttons.svelte-wnpgdq.svelte-wnpgdq{display:flex;gap:1rem}.row.svelte-wnpgdq .buttons button.svelte-wnpgdq.svelte-wnpgdq{font-size:0.875rem;padding-block:0.5rem}',
      map: null
    };
    Page2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_theme;
      $$unsubscribe_theme = subscribe(theme, (value) => value);
      let { data } = $$props;
      const roles = [...new Set(Object.entries(roleOperations).flatMap(([key2, x]) => x.roles))];
      roles.map((x) => ({
        value: x,
        label: capitalizeFirstCharacter(x)
      }));
      data.session.user;
      data.users;
      let searchEmailValue, inviteUserModal, inviteUserEmail, confirmDeleteModal, updatePasswordModal, selectedUser, modalError = {};
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css12);
      let $$settled;
      let $$rendered;
      do {
        $$settled = true;
        $$rendered = `${validate_component(Modal, "Modal").$$render(
          $$result,
          { this: updatePasswordModal },
          {
            this: ($$value) => {
              updatePasswordModal = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `<div class="modal modal__updatePassword svelte-wnpgdq"><h1 class="svelte-wnpgdq" data-svelte-h="svelte-lgqgv5">Set Password</h1> <span class="info svelte-wnpgdq" data-svelte-h="svelte-1uir656">Please avoid manually setting a user password. This platform utilizes password-less authentication methods,
            such as magic links or OTP.</span> <span class="info svelte-wnpgdq" data-svelte-h="svelte-1btkzsq">Utilize this function solely in situations where a user is unable to access their email.</span> <div class="inputBox svelte-wnpgdq"><input${add_attribute("type", "password", 0)} placeholder="Enter Password" class="svelte-wnpgdq"> <button class="none icon svelte-wnpgdq">${`${validate_component(Icon, "Icon").$$render($$result, { icon: "mdi:show" }, {}, {})}`}</button></div> <div class="buttonGroup svelte-wnpgdq"><button class="icon alt svelte-wnpgdq" data-svelte-h="svelte-1sme3p1">Confirm</button> <button class="svelte-wnpgdq" data-svelte-h="svelte-1bszdh7">Cancel</button></div></div>`;
            }
          }
        )} ${validate_component(Modal, "Modal").$$render(
          $$result,
          { this: confirmDeleteModal },
          {
            this: ($$value) => {
              confirmDeleteModal = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `<div class="modal modal__deleteUser svelte-wnpgdq"><h1 class="svelte-wnpgdq" data-svelte-h="svelte-1194l27">Confirm to delete user</h1> <span class="svelte-wnpgdq">This is permanent! Are you sure you want to delete user &quot;${escape(selectedUser.email)}&quot; ?</span> <div class="buttonGroup svelte-wnpgdq"><button class="icon alt svelte-wnpgdq" data-svelte-h="svelte-yribkb">Confirm</button> <button class="svelte-wnpgdq" data-svelte-h="svelte-z8q7io">Cancel</button></div></div>`;
            }
          }
        )} ${validate_component(Modal, "Modal").$$render(
          $$result,
          { this: inviteUserModal },
          {
            this: ($$value) => {
              inviteUserModal = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `<div class="modal modal__createUser svelte-wnpgdq"><h1 class="svelte-wnpgdq" data-svelte-h="svelte-5rq6oz">Invite a new user</h1> <div class="field svelte-wnpgdq"><label for="create_email" data-svelte-h="svelte-6hvelu">User Email</label> <div class="inputBox svelte-wnpgdq"><div class="icon svelte-wnpgdq">${validate_component(Icon, "Icon").$$render($$result, { icon: "carbon:email", width: "24" }, {}, {})}</div> <input type="email" id="create_email" placeholder="Email" class="svelte-wnpgdq"${add_attribute("value", inviteUserEmail, 0)}></div></div> ${modalError.email ? `<div class="error svelte-wnpgdq"><div class="icon svelte-wnpgdq">${validate_component(Icon, "Icon").$$render(
                $$result,
                {
                  icon: "material-symbols:info-outline",
                  height: "20"
                },
                {},
                {}
              )}</div> <span class="svelte-wnpgdq">${escape(modalError.email.message)}</span></div>` : ``} <span class="info svelte-wnpgdq" data-svelte-h="svelte-1tsh5rc">Please ensure the email provided is a valid email address, an invitation will be send to the user email
            address.</span> <button class="alt svelte-wnpgdq" data-svelte-h="svelte-1u76awe">Invite User</button></div>`;
            }
          }
        )} ${``} <h1 class="svelte-wnpgdq" data-svelte-h="svelte-xgnj48">User Management</h1> <div class="row svelte-wnpgdq"><div class="inputBox svelte-wnpgdq"><div class="icon svelte-wnpgdq">${validate_component(Icon, "Icon").$$render(
          $$result,
          {
            icon: "akar-icons:search",
            hFlip: true,
            height: "16"
          },
          {},
          {}
        )}</div> <input type="text" placeholder="Search by email" class="svelte-wnpgdq"${add_attribute("value", searchEmailValue, 0)}> ${``}</div> <div class="buttons svelte-wnpgdq"><button class="alt svelte-wnpgdq" data-svelte-h="svelte-1b95gdx">Invite User</button></div></div> ${``}`;
      } while (!$$settled);
      $$unsubscribe_theme();
      return $$rendered;
    });
  }
});

// .svelte-kit/output/server/nodes/7.js
var __exports8 = {};
__export(__exports8, {
  component: () => component8,
  fonts: () => fonts8,
  imports: () => imports8,
  index: () => index8,
  server: () => page_server_exports,
  server_id: () => server_id5,
  stylesheets: () => stylesheets8
});
var index8, component_cache8, component8, server_id5, imports8, stylesheets8, fonts8;
var init__8 = __esm({
  ".svelte-kit/output/server/nodes/7.js"() {
    init_page_server();
    index8 = 7;
    component8 = async () => component_cache8 ?? (component_cache8 = (await Promise.resolve().then(() => (init_page_svelte2(), page_svelte_exports2))).default);
    server_id5 = "src/routes/(admin)/admin/users/+page.server.js";
    imports8 = ["_app/immutable/nodes/7.578cb520.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/dayjs.min.711fbee9.js", "_app/immutable/chunks/index.cb398640.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/Modal.674a565a.js", "_app/immutable/chunks/Tooltip.342119e2.js", "_app/immutable/chunks/index.aead3cc0.js", "_app/immutable/chunks/globals.7f7f1b26.js", "_app/immutable/chunks/notify.store.1d2474ed.js", "_app/immutable/chunks/helper.a19e06e9.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/preload-helper.a4192956.js"];
    stylesheets8 = ["_app/immutable/assets/7.6dcd5036.css", "_app/immutable/assets/WaterfallSingle.0c89d209.css"];
    fonts8 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/_page.server.js
var page_server_exports2 = {};
__export(page_server_exports2, {
  load: () => load7
});
function load7() {
  throw redirect(302, "/ifcsg");
}
var init_page_server2 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/_page.server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/nodes/8.js
var __exports9 = {};
__export(__exports9, {
  fonts: () => fonts9,
  imports: () => imports9,
  index: () => index9,
  server: () => page_server_exports2,
  server_id: () => server_id6,
  stylesheets: () => stylesheets9
});
var index9, server_id6, imports9, stylesheets9, fonts9;
var init__9 = __esm({
  ".svelte-kit/output/server/nodes/8.js"() {
    init_page_server2();
    index9 = 8;
    server_id6 = "src/routes/(main)/+page.server.js";
    imports9 = [];
    stylesheets9 = [];
    fonts9 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/area-gfa/_page.svelte.js
var page_svelte_exports3 = {};
__export(page_svelte_exports3, {
  default: () => Page3
});
var import_dayjs2, css13, Page3;
var init_page_svelte3 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/area-gfa/_page.svelte.js"() {
    init_ssr();
    init_theme_store();
    init_Icon();
    init_Modal();
    import_dayjs2 = __toESM(require_dayjs_min(), 1);
    css13 = {
      code: ".loading.svelte-13omeyh.svelte-13omeyh{grid-column:1/-1;padding-top:2rem;margin-inline:auto;width:1100px;min-height:100vh;padding-bottom:100px;display:flex;flex-direction:column;align-items:center;justify-content:center}.loading.svelte-13omeyh .icon.svelte-13omeyh{dislay:flex;flex-direction:column;color:var(--grey-light)}.modal__content.svelte-13omeyh.svelte-13omeyh{width:500px;display:flex;gap:0.5rem;flex-direction:column}.modal__content.svelte-13omeyh h3.svelte-13omeyh{margin:0;padding-bottom:1rem}.modal__content.svelte-13omeyh .field.svelte-13omeyh{display:flex;gap:0.5rem;padding-bottom:0.5rem;border-bottom:1px solid var(--mono-300)}.modal__content.svelte-13omeyh .field .label.svelte-13omeyh{font-size:0.875rem;opacity:0.75}.content.svelte-13omeyh.svelte-13omeyh{grid-column:1/-1;padding-top:2rem;margin-inline:auto;width:1200px;min-height:100vh;padding-bottom:100px;display:flex;flex-direction:column;gap:1rem}.content.svelte-13omeyh .header.svelte-13omeyh{display:flex;gap:1rem;justify-content:space-between}.content.svelte-13omeyh .header .select.svelte-13omeyh{width:300px}.content.svelte-13omeyh .header .lastUpdated.svelte-13omeyh{display:flex;gap:1rem;align-items:center}table.svelte-13omeyh th div.svelte-13omeyh{font-size:inherit}table.svelte-13omeyh tbody tr td.svelte-13omeyh:nth-child(3),table.svelte-13omeyh tbody tr td.svelte-13omeyh:nth-child(4){width:140px}table.svelte-13omeyh .actions.svelte-13omeyh{width:fit-content;margin-left:1rem}table.svelte-13omeyh .table__spaceName.svelte-13omeyh{padding-inline:0.25rem;display:flex;flex-wrap:nowrap;width:100%;justify-content:space-between}table.svelte-13omeyh .table__spaceName .name.svelte-13omeyh{text-align:left}table.svelte-13omeyh .table__spaceName .icon.svelte-13omeyh{width:fit-content;color:var(--mono-200);display:flex;justify-content:center;align-items:center;opacity:0;transition:opacity 0.15s}table.svelte-13omeyh .table__spaceName.svelte-13omeyh:hover{color:var(--accent)}table.svelte-13omeyh .table__spaceName:hover .icon.svelte-13omeyh{opacity:1}",
      map: null
    };
    Page3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_theme;
      $$unsubscribe_theme = subscribe(theme, (value) => value);
      let modal, modalData;
      $$result.css.add(css13);
      let $$settled;
      let $$rendered;
      do {
        $$settled = true;
        $$rendered = `${validate_component(Modal, "Modal").$$render(
          $$result,
          { this: modal },
          {
            this: ($$value) => {
              modal = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `<div class="modal__content svelte-13omeyh"><h3 class="svelte-13omeyh">${escape(modalData["DC Spaces"])}</h3> ${each(Object.entries(modalData), ([key2, value]) => {
                return `<div class="field svelte-13omeyh"><div class="label svelte-13omeyh">${escape(key2)}:</div> <div class="value">${escape(value ? value : "\u2013")}</div> </div>`;
              })}</div>`;
            }
          }
        )} ${`<div class="content loading svelte-13omeyh"><div class="icon svelte-13omeyh">${validate_component(Icon, "Icon").$$render(
          $$result,
          {
            icon: "line-md:loading-twotone-loop",
            height: "128"
          },
          {},
          {}
        )} <p data-svelte-h="svelte-1j89jkm">Fetching data...</p></div></div>`}`;
      } while (!$$settled);
      $$unsubscribe_theme();
      return $$rendered;
    });
  }
});

// .svelte-kit/output/server/nodes/9.js
var __exports10 = {};
__export(__exports10, {
  component: () => component9,
  fonts: () => fonts10,
  imports: () => imports10,
  index: () => index10,
  stylesheets: () => stylesheets10
});
var index10, component_cache9, component9, imports10, stylesheets10, fonts10;
var init__10 = __esm({
  ".svelte-kit/output/server/nodes/9.js"() {
    index10 = 9;
    component9 = async () => component_cache9 ?? (component_cache9 = (await Promise.resolve().then(() => (init_page_svelte3(), page_svelte_exports3))).default);
    imports10 = ["_app/immutable/nodes/9.6f3cfc06.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/dayjs.min.711fbee9.js", "_app/immutable/chunks/index.cb398640.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/Modal.674a565a.js", "_app/immutable/chunks/notify.store.1d2474ed.js"];
    stylesheets10 = ["_app/immutable/assets/9.70b92b50.css", "_app/immutable/assets/WaterfallSingle.0c89d209.css"];
    fonts10 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/email-confirmed/_page.svelte.js
var page_svelte_exports4 = {};
__export(page_svelte_exports4, {
  default: () => Page4
});
var css14, Page4;
var init_page_svelte4 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/email-confirmed/_page.svelte.js"() {
    init_ssr();
    css14 = {
      code: ".content.svelte-1d85kkg{margin-top:200px;grid-column:1/-1;margin-inline:auto;width:800px;min-height:calc(100vh - 70px);display:flex;align-items:center;flex-direction:column}",
      map: null
    };
    Page4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css14);
      return `<div class="content svelte-1d85kkg" data-svelte-h="svelte-1k977h7"><h2>Email Login Success</h2> <p>Your email address was successfully authenticated.</p> <p>You can now close this page.</p>  </div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/10.js
var __exports11 = {};
__export(__exports11, {
  component: () => component10,
  fonts: () => fonts11,
  imports: () => imports11,
  index: () => index11,
  stylesheets: () => stylesheets11
});
var index11, component_cache10, component10, imports11, stylesheets11, fonts11;
var init__11 = __esm({
  ".svelte-kit/output/server/nodes/10.js"() {
    index11 = 10;
    component10 = async () => component_cache10 ?? (component_cache10 = (await Promise.resolve().then(() => (init_page_svelte4(), page_svelte_exports4))).default);
    imports11 = ["_app/immutable/nodes/10.b0296050.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js"];
    stylesheets11 = ["_app/immutable/assets/10.50d9f724.css"];
    fonts11 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/ifcsg/_page.server.js
var page_server_exports3 = {};
__export(page_server_exports3, {
  load: () => load8
});
async function load8({ locals: { supabase: supabase2, getSession }, url }) {
  const session2 = await getSession();
  if (!session2) {
    throw redirect(307, `login`);
  }
}
var init_page_server3 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/ifcsg/_page.server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/chunks/navigation.js
function client_method(key2) {
  {
    if (key2 === "before_navigate" || key2 === "after_navigate" || key2 === "on_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key2] ?? key2}(...) on the server`);
      };
    }
  }
}
var goto;
var init_navigation = __esm({
  ".svelte-kit/output/server/chunks/navigation.js"() {
    goto = /* @__PURE__ */ client_method("goto");
  }
});

// .svelte-kit/output/server/entries/pages/(main)/ifcsg/_page.svelte.js
var page_svelte_exports5 = {};
__export(page_svelte_exports5, {
  default: () => Page5
});
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component20 = dirty_components[flushidx];
        flushidx++;
        set_current_component(component20);
        update(component20.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var import_dayjs3, dirty_components, binding_callbacks, render_callbacks, flush_callbacks, resolved_promise, update_scheduled, seen_callbacks, flushidx, css$22, Select, defaultMeasureResourceList, css$17, Update, css15, Page5;
var init_page_svelte5 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/ifcsg/_page.svelte.js"() {
    init_ssr();
    init_functions();
    init_theme_store();
    init_helper2();
    import_dayjs3 = __toESM(require_dayjs_min(), 1);
    init_supabase_store();
    init_navigation();
    init_Icon();
    init_Modal();
    dirty_components = [];
    binding_callbacks = [];
    render_callbacks = [];
    flush_callbacks = [];
    resolved_promise = /* @__PURE__ */ Promise.resolve();
    update_scheduled = false;
    seen_callbacks = /* @__PURE__ */ new Set();
    flushidx = 0;
    css$22 = {
      code: ".select__container.svelte-cu9kn9.svelte-cu9kn9{height:100%;height:fit-content;position:relative;display:flex;flex-direction:column}.select__container.svelte-cu9kn9 .select.svelte-cu9kn9{background-color:var(--background-primary);min-width:200px;border:1px solid var(--mono-300);padding:0.5rem;padding-block:0.5rem;border-radius:var(--select-border-radius);width:100%;height:100%;display:flex;align-items:center;cursor:pointer;transition:border 0.25s;width:auto}.select__container.svelte-cu9kn9 .select.open.svelte-cu9kn9{border-radius:var(--select-border-radius) var(--select-border-radius) 0 0;border-bottom:1px solid var(--mono-100) !important}.select__container.svelte-cu9kn9 .select.focus.svelte-cu9kn9{border-color:var(--accent-500)}.select__container.svelte-cu9kn9 .select .expand.svelte-cu9kn9{display:flex;justify-content:center;align-items:center;margin-left:auto;color:var(--mono-500)}.select__container.svelte-cu9kn9 .select.error.svelte-cu9kn9{border-color:#cf3a3a}.select__container.svelte-cu9kn9 .select .search__container.svelte-cu9kn9{display:flex;align-items:center;gap:0.5rem;width:100%}.select__container.svelte-cu9kn9 .select .search__container input.svelte-cu9kn9{width:100%;border:none;border-radius:0;font-style:inherit;font-size:1rem;padding:0 !important}.select__container.svelte-cu9kn9 .select .search__container input.svelte-cu9kn9:focus{outline:none;background-color:inherit}.select__container.svelte-cu9kn9 .select .search__container input.svelte-cu9kn9::placeholder{font-size:inherit;color:var(--mono-300)}.dropdown.svelte-cu9kn9.svelte-cu9kn9{top:100%;position:var(--select-dropdown-position);right:0;box-sizing:border-box;border-radius:0 0 var(--select-border-radius) var(--select-border-radius);border:1px solid var(--accent-500);border-top:0px;width:100%;background-color:var(--background-primary);display:flex;flex-direction:column;z-index:10;max-height:220px;overflow:hidden}.dropdown.svelte-cu9kn9 .items_container.svelte-cu9kn9{height:auto;overflow-y:auto;padding-block:0.25rem}.dropdown.svelte-cu9kn9 .items_container .item.svelte-cu9kn9{padding-inline:0.5rem;padding-block:var(--select-padding);cursor:pointer}.dropdown.svelte-cu9kn9 .items_container .item.svelte-cu9kn9:hover{background-color:var(--mono-100)}.dropdown.svelte-cu9kn9 .items_container .item.hide.svelte-cu9kn9{display:none}.dropdown.svelte-cu9kn9 .items_container .item.selected.svelte-cu9kn9{background-color:color-mix(in srgb, var(--accent) 75%, transparent)}.dropdown.svelte-cu9kn9 .items_container .item.preselected.svelte-cu9kn9{background-color:color-mix(in srgb, var(--accent) 25%, transparent)}.dropdown.svelte-cu9kn9 .items_container .item.item__border.svelte-cu9kn9{border-bottom:1px solid var(--mono-100)}.dropdown.svelte-cu9kn9 .items_container .no_options_found.svelte-cu9kn9{padding:calc(var(--select-padding) - 0.125rem);color:var(--mono-300);text-align:center}",
      map: null
    };
    Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let open = false, foundSearch = true, input, error2, preselected, dropdown;
      let { dropdownRelative = false } = $$props;
      let dropdownDisplay = dropdownRelative ? "relative" : "absolute";
      let { items } = $$props;
      let { itemBorder = false } = $$props;
      let { searchable = false } = $$props;
      let { placeholder = searchable ? "Search..." : "Select an option" } = $$props;
      let { defaultValue = [] } = $$props;
      let { maxHeight = 220 } = $$props;
      let { rows = 0 } = $$props;
      let { style = { borderRadius: "0.5rem", padding: ".5rem" } } = $$props;
      let { animationDuration = 250 } = $$props;
      const dispatch = createEventDispatcher();
      const arrItems = (() => {
        if (!items) {
          return [];
        }
        const arr = [];
        items.forEach((item) => {
          if (typeof item !== "object") {
            return arr.push({ value: item, label: item, match: true });
          }
          item.match = true;
          arr.push(item);
        });
        return arr;
      })();
      let { selected = (() => {
        if (placeholder && !defaultValue)
          return null;
        if (Array.isArray(defaultValue)) {
          return arrItems[defaultValue[0]];
        } else {
          for (const item of arrItems) {
            if (item.value == defaultValue) {
              return item;
            }
          }
        }
        return null;
      })() } = $$props;
      function change(item) {
        error2 = false;
        if (searchable && input) {
          input.value = item.label;
        }
        selected = { ...item };
        closeDropdown();
        dispatch("change", selected);
      }
      function closeDropdown() {
        open = false;
        if (searchable) {
          preselected = false;
          placeholder = false;
        }
      }
      function getSelected() {
        return selected;
      }
      function getValue() {
        if (!selected) {
          return null;
        }
        return selected.value;
      }
      function setError() {
        error2 = true;
      }
      function reset2() {
        selected = null;
      }
      if ($$props.dropdownRelative === void 0 && $$bindings.dropdownRelative && dropdownRelative !== void 0)
        $$bindings.dropdownRelative(dropdownRelative);
      if ($$props.items === void 0 && $$bindings.items && items !== void 0)
        $$bindings.items(items);
      if ($$props.itemBorder === void 0 && $$bindings.itemBorder && itemBorder !== void 0)
        $$bindings.itemBorder(itemBorder);
      if ($$props.searchable === void 0 && $$bindings.searchable && searchable !== void 0)
        $$bindings.searchable(searchable);
      if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
        $$bindings.placeholder(placeholder);
      if ($$props.defaultValue === void 0 && $$bindings.defaultValue && defaultValue !== void 0)
        $$bindings.defaultValue(defaultValue);
      if ($$props.maxHeight === void 0 && $$bindings.maxHeight && maxHeight !== void 0)
        $$bindings.maxHeight(maxHeight);
      if ($$props.rows === void 0 && $$bindings.rows && rows !== void 0)
        $$bindings.rows(rows);
      if ($$props.style === void 0 && $$bindings.style && style !== void 0)
        $$bindings.style(style);
      if ($$props.animationDuration === void 0 && $$bindings.animationDuration && animationDuration !== void 0)
        $$bindings.animationDuration(animationDuration);
      if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
        $$bindings.selected(selected);
      if ($$props.change === void 0 && $$bindings.change && change !== void 0)
        $$bindings.change(change);
      if ($$props.getSelected === void 0 && $$bindings.getSelected && getSelected !== void 0)
        $$bindings.getSelected(getSelected);
      if ($$props.getValue === void 0 && $$bindings.getValue && getValue !== void 0)
        $$bindings.getValue(getValue);
      if ($$props.setError === void 0 && $$bindings.setError && setError !== void 0)
        $$bindings.setError(setError);
      if ($$props.reset === void 0 && $$bindings.reset && reset2 !== void 0)
        $$bindings.reset(reset2);
      $$result.css.add(css$22);
      return ` <div class="select__container svelte-cu9kn9" style="${"--select-border-radius: " + escape(style.borderRadius, true) + "; --select-padding:" + escape(style.padding, true) + ";"}"> <div class="${[
        "select svelte-cu9kn9",
        (error2 ? "error" : "") + " " + (open ? "open" : "") + " " + (selected == null ? "placeholder" : "") + " " + (open == true ? "focus" : "")
      ].join(" ").trim()}"${add_attribute("data-value", selected ? selected.value : "", 0)}>${searchable ? `<div class="search__container svelte-cu9kn9"><input spellcheck="false" autocomplete="false"${add_attribute("placeholder", selected ? selected.label : placeholder || "Search...", 0)} class="${[
        "svelte-cu9kn9",
        ""
      ].join(" ").trim()}"${add_attribute("this", input, 0)}></div>` : `<div class="label">${escape(selected == null ? placeholder : selected.label)}</div>`} <div class="expand svelte-cu9kn9">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "ic:outline-expand-more",
          width: "20",
          inline: true
        },
        {},
        {}
      )}</div></div> ${open ? `<div class="dropdown svelte-cu9kn9" style="${"--select-dropdown-position:" + escape(dropdownDisplay, true) + "; max-height:" + escape(maxHeight, true) + "px"}"${add_attribute("this", dropdown, 0)}><div class="items_container svelte-cu9kn9"> ${each(arrItems, (item) => {
        return ` <div class="${[
          "item svelte-cu9kn9",
          (itemBorder ? "item__border" : "") + " " + (!item.match && input && input.value.length ? "hide" : "") + " " + ((selected ? selected.value == item.value : false) ? "selected" : "") + " " + ((preselected ? preselected.value == item.value : false) ? "preselected" : "")
        ].join(" ").trim()}">${escape(item.label)} </div>`;
      })} ${searchable && !foundSearch ? `<div class="no_options_found svelte-cu9kn9" data-svelte-h="svelte-xbj327">No options found</div>` : ``}</div></div>` : ``} </div>`;
    });
    defaultMeasureResourceList = [
      "IfcAbsorbedDoseMeasure",
      "IfcAccelerationMeasure",
      "IfcPHMeasure",
      "IfcRadioActivityMeasure",
      "IfcAmountOfSubstanceMeasure",
      "IfcAngularVelocityMeasure",
      "IfcAreaMeasure",
      "IfcAreaDensityMeasure",
      "IfcBoolean",
      "IfcComplexNumber",
      "IfcCompoundPlaneAngleMeasure",
      "IfcContextDependentMeasure",
      "IfcCountMeasure",
      "IfcDescriptiveMeasure",
      "IfcElectricCapacitanceMeasure",
      "IfcThermodynamicTemperatureMeasure",
      "IfcCurvatureMeasure",
      "IfcDate",
      "IfcDateTime",
      "IfcDoseEquivalentMeasure",
      "IfcDuration",
      "IfcDynamicViscosityMeasure",
      "IfcElectricChargeMeasure",
      "IfcElectricConductanceMeasure",
      "IfcElectricCurrentMeasure",
      "IfcElectricVoltageMeasure",
      "IfcElectricResistanceMeasure",
      "IfcEnergyMeasure",
      "IfcForceMeasure",
      "IfcFrequencyMeasure",
      "IfcHeatFluxDensityMeasure",
      "IfcHeatingValueMeasure",
      "IfcIdentifier",
      "IfcIlluminanceMeasure",
      "IfcInductanceMeasure",
      "IfcInteger",
      "IfcIntegerCountRateMeasure",
      "IfcIonConcentrationMeasure",
      "IfcIsothermalMoistureCapacityMeasure",
      "IfcKinematicViscosityMeasure",
      "IfcLengthMeasure",
      "IfcLabel",
      "IfcLinearForceMeasure",
      "IfcLinearMomentMeasure",
      "IfcLinearStiffnessMeasure",
      "IfcLinearVelocityMeasure",
      "IfcLogical",
      "IfcLuminousFluxMeasure",
      "IfcLuminousIntensityMeasure",
      "IfcLuminousIntensityDistributionMeasure",
      "IfcMagneticFluxMeasure",
      "IfcMagneticFluxDensityMeasure",
      "IfcMassMeasure",
      "IfcMassDensityMeasure",
      "IfcMassFlowRateMeasure",
      "IfcMassPerLengthMeasure",
      "IfcModulusOfElasticityMeasure",
      "IfcModulusOfLinearSubgradeReactionMeasure",
      "IfcModulusOfRotationalSubgradeReactionMeasure",
      "IfcModulusOfSubgradeReactionMeasure",
      "IfcMoistureDiffusivityMeasure",
      "IfcMolecularWeightMeasure",
      "IfcMomentOfInertiaMeasure",
      "IfcMonetaryMeasure",
      "IfcNonNegativeLengthMeasure",
      "IfcNormalisedRatioMeasure",
      "IfcNumericMeasure",
      "IfcParameterValue",
      "IfcPlanarForceMeasure",
      "IfcPlaneAngleMeasure",
      "IfcPositiveLengthMeasure",
      "IfcPositivePlaneAngleMeasure",
      "IfcPositiveRatioMeasure",
      "IfcPowerMeasure",
      "IfcPressureMeasure",
      "IfcRatioMeasure",
      "IfcReal",
      "IfcRotationalFrequencyMeasure",
      "IfcRotationalMassMeasure",
      "IfcRotationalStiffnessMeasure",
      "IfcSectionalAreaIntegralMeasure",
      "IfcSectionModulusMeasure",
      "IfcShearModulusMeasure",
      "IfcSolidAngleMeasure",
      "IfcSoundPowerMeasure",
      "IfcSoundPowerLevelMeasure",
      "IfcSoundPressureMeasure",
      "IfcSoundPressureLevelMeasure",
      "IfcSpecificHeatCapacityMeasure",
      "IfcTemperatureGradientMeasure",
      "IfcTemperatureRateOfChangeMeasure",
      "IfcText",
      "IfcThermalAdmittanceMeasure",
      "IfcThermalConductivityMeasure",
      "IfcThermalExpansionCoefficientMeasure",
      "IfcThermalResistanceMeasure",
      "IfcThermalTransmittanceMeasure",
      "IfcThermodynamicTemperatureMeasure",
      "IfcTime",
      "IfcTimeMeasure",
      "IfcTimeStamp",
      "IfcTorqueMeasure",
      "IfcVaporPermeabilityMeasure",
      "IfcVolumeMeasure",
      "IfcVolumetricFlowRateMeasure",
      "IfcWarpingConstantMeasure",
      "IfcWarpingMomentMeasure"
    ];
    css$17 = {
      code: '.modal.svelte-h03rxd.svelte-h03rxd{width:500px;display:flex;flex-direction:column;height:auto;gap:1rem}.modal.svelte-h03rxd h1.svelte-h03rxd{margin-top:0;margin-bottom:1rem;font-size:24px;position:relative;width:fit-content}.modal.svelte-h03rxd h1.svelte-h03rxd:after{position:absolute;bottom:-0.5rem;left:0;content:"";width:100%;height:4px;background-color:var(--accent-500)}.modal.svelte-h03rxd .info.svelte-h03rxd{color:var(--mono-500);font-size:0.875rem}.modal.svelte-h03rxd .buttonGroup.svelte-h03rxd{padding-top:1rem;margin-top:auto;display:flex;flex-direction:row-reverse;margin-right:auto;gap:0.5rem}.modal.svelte-h03rxd .buttonGroup button.svelte-h03rxd{width:100px}.modal.svelte-h03rxd .select.svelte-h03rxd{padding:0 !important;font-size:0.875rem;width:100%}',
      map: null
    };
    Update = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $theme, $$unsubscribe_theme;
      $$unsubscribe_theme = subscribe(theme, (value) => $theme = value);
      let { data } = $$props;
      let measureResourceList = defaultMeasureResourceList;
      let showModal;
      let showComplexMeasureList;
      let remount = true;
      createEventDispatcher();
      async function updateList() {
        {
          measureResourceList = ["IfcReal", "IfcAreaMeasure", "IfcLabel"];
        }
        remount = false;
        await tick();
        remount = true;
        console.log(measureResourceList);
      }
      function show() {
        showModal = true;
        console.log(data);
      }
      function close() {
        showModal = false;
      }
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      if ($$props.show === void 0 && $$bindings.show && show !== void 0)
        $$bindings.show(show);
      if ($$props.close === void 0 && $$bindings.close && close !== void 0)
        $$bindings.close(close);
      $$result.css.add(css$17);
      {
        updateList();
      }
      $$unsubscribe_theme();
      return `${showModal ? `${validate_component(Modal, "Modal").$$render($$result, { exitOutsideClick: false, show: true }, {}, {
        default: () => {
          return `<div class="modal svelte-h03rxd">${data.code == "update-IfcMeasureResource" ? `<h1 class="svelte-h03rxd" data-svelte-h="svelte-1q9c86v">Update IfcMeasureResource</h1> <span class="info svelte-h03rxd">Update IfcMeasureResource for &quot;${escape(data.prop.propertyName)}&quot;</span> <table class="${"horizontal " + escape($theme, true) + " svelte-h03rxd"}"><tr><th style="width:100px" data-svelte-h="svelte-1prjdwh">PropertyName</th> <td>${escape(data.prop.propertyName)}</td></tr> <tr><th data-svelte-h="svelte-ejjzgm">DataType</th> <td>${escape(data.prop.dataType)}</td></tr> <tr><th style="vertical-align: top;" data-svelte-h="svelte-uarhpi">IfcMeasureResource</th> <td>${escape(data.prop.measureResource || "\u2013")}</td></tr></table> <div class="row"><input id="measureResouceListSimple" type="checkbox"${add_attribute("checked", showComplexMeasureList, 1)}> <label for="measureResouceListSimple" data-svelte-h="svelte-1snqico">Show all value types</label></div> <div class="select svelte-h03rxd">${remount ? `${validate_component(Select, "Select").$$render(
            $$result,
            {
              searchable: true,
              dropdownRelative: true,
              rows: measureResourceList.length < 8 ? measureResourceList.length : 8,
              items: measureResourceList,
              style: { borderRadius: "0.5rem", padding: ".5rem" }
            },
            {},
            {}
          )}` : ``}</div> <div class="buttonGroup svelte-h03rxd"><button class="icon alt svelte-h03rxd" data-svelte-h="svelte-dnilit">Confirm</button> <button class="svelte-h03rxd" data-svelte-h="svelte-1jzix4w">Cancel</button></div>` : `${data.code == "update-description" ? `<h1 class="svelte-h03rxd" data-svelte-h="svelte-1lzoyvj">Update description</h1> <span class="info svelte-h03rxd">Update description for &quot;${escape(data.prop.PropertyName)}&quot;</span> <table class="${"horizontal " + escape($theme, true) + " svelte-h03rxd"}"><tr><th style="width:100px" data-svelte-h="svelte-1prjdwh">PropertyName</th> <td>${escape(data.prop.PropertyName)}</td></tr> <tr><th data-svelte-h="svelte-ejjzgm">DataType</th> <td>${escape(data.prop.DataType)}</td></tr> <tr><th style="vertical-align: top;" data-svelte-h="svelte-uarhpi">IfcMeasureResource</th> <td>${escape(data.prop.IfcMeasureResource || "\u2013")}</td></tr></table> <textarea placeholder="Enter description">${escape(data.prop.Description || "")}</textarea> <div class="buttonGroup svelte-h03rxd"><button class="icon alt svelte-h03rxd" data-svelte-h="svelte-tdrtli">Confirm</button> <button class="svelte-h03rxd" data-svelte-h="svelte-1jzix4w">Cancel</button></div>` : ``}`}</div>`;
        }
      })}` : ``}`;
    });
    css15 = {
      code: '.version.svelte-33qklv.svelte-33qklv{display:flex;align-items:center;gap:1rem;width:350px}.home.svelte-33qklv .divider.svelte-33qklv{position:relative;text-align:center;padding-block:1rem}.home.svelte-33qklv .divider.svelte-33qklv::before{content:"";position:absolute;top:50%;left:0;right:0;border-top:1px solid #ccc}.loading.svelte-33qklv.svelte-33qklv{grid-column:1/-1;padding-top:2rem;margin-inline:auto;width:1100px;min-height:100vh;padding-bottom:100px;display:flex;flex-direction:column;align-items:center;justify-content:center}.loading.svelte-33qklv .icon.svelte-33qklv{display:flex;flex-direction:column;color:var(--grey-light)}.sidebar.svelte-33qklv.svelte-33qklv{position:sticky;top:70px;height:calc(100svh - 70px);overflow-y:auto;border-right:1px solid var(--grey-lighter)}.content.svelte-33qklv.svelte-33qklv{padding-top:2rem;margin-inline:auto;width:100%;max-width:min(100vw - 300px, 1500px);min-height:100vh;padding-bottom:100px;padding-inline:2rem}.content.svelte-33qklv .doc.svelte-33qklv{display:flex;flex-direction:column;gap:2rem}.content.svelte-33qklv .card.svelte-33qklv{padding:2rem;display:grid;gap:0.5rem;border-radius:0.5rem;background-color:var(--bg-alt)}.content.svelte-33qklv .card .alert.svelte-33qklv{padding-bottom:1rem;font-size:1.2rem;color:#e9686a !important}.content.svelte-33qklv .card.invalid.svelte-33qklv{filter:opacity(0.25)}.content.svelte-33qklv .table_wrapper table.svelte-33qklv{min-width:1300px;width:100%;table-layout:auto;border-collapse:collapse;background-color:var(--bg-p)}.content.svelte-33qklv .table_wrapper table th.svelte-33qklv{font-size:14px;font-weight:400}.content.svelte-33qklv .table_wrapper table.light th.svelte-33qklv{background-color:#f4f6f6}.content.svelte-33qklv .table_wrapper table.light th.svelte-33qklv,.content.svelte-33qklv .table_wrapper table.light td.svelte-33qklv{border:1px solid var(--grey-lightest)}.content.svelte-33qklv .table_wrapper table.light tbody tr:hover td.svelte-33qklv{background-color:rgba(179, 204, 224, 0.25)}.content.svelte-33qklv .table_wrapper table.dark th.svelte-33qklv{background-color:#292e35}.content.svelte-33qklv .table_wrapper table.dark th.svelte-33qklv,.content.svelte-33qklv .table_wrapper table.dark td.svelte-33qklv{border:1px solid var(--grey-lighter)}.content.svelte-33qklv .table_wrapper table.dark tbody tr:hover td.svelte-33qklv{background-color:rgba(39, 92, 139, 0.25)}.content.svelte-33qklv .table_wrapper table th.svelte-33qklv:first-child,.content.svelte-33qklv .table_wrapper table td.svelte-33qklv:first-child{border-left:none}.content.svelte-33qklv .table_wrapper table th.svelte-33qklv:last-child,.content.svelte-33qklv .table_wrapper table td.svelte-33qklv:last-child{border-right:none}.content.svelte-33qklv .table_wrapper table tr:first-child th.svelte-33qklv{border-top:none}.content.svelte-33qklv .table_wrapper table tr:last-child td.svelte-33qklv{border-bottom:none}.content.svelte-33qklv .table_wrapper table td.svelte-33qklv{font-size:0.875rem;height:0}.content.svelte-33qklv .table_wrapper table td div.svelte-33qklv{padding-block:0.25rem;padding-inline:0.5rem;display:flex;width:fit-content;white-space:break-spaces;gap:2px;flex-wrap:wrap;width:100%}.content.svelte-33qklv .table_wrapper table tr.headertitle th div.svelte-33qklv{padding-block:1rem;padding-inline:0.5rem;display:flex;justify-content:center;font-size:1rem;font-weight:500}.content.svelte-33qklv .table_wrapper table tr.header th div.svelte-33qklv{padding-block:0.25rem;padding-inline:0.5rem;display:flex;font-weight:600}.content.svelte-33qklv .table_wrapper table tr td.svelte-33qklv:first-child{width:200px}.content.svelte-33qklv .table_wrapper table tr td.svelte-33qklv:nth-child(2){width:150px}.content.svelte-33qklv .table_wrapper table tr td.svelte-33qklv:nth-child(3){width:200px}.content.svelte-33qklv .table_wrapper table tr td.svelte-33qklv:nth-child(4){width:450px}.content.svelte-33qklv .table_wrapper table tr td.svelte-33qklv:nth-child(5){width:auto}.content.svelte-33qklv .table_wrapper table .tblPset__measureResource.svelte-33qklv,.content.svelte-33qklv .table_wrapper table .tblPset__description.svelte-33qklv{display:flex;align-items:center;justify-content:space-between;height:100%}.content.svelte-33qklv .table_wrapper table .tblPset__measureResource span.svelte-33qklv,.content.svelte-33qklv .table_wrapper table .tblPset__description span.svelte-33qklv{width:calc(100% - 1.5rem)}.content.svelte-33qklv .table_wrapper table .tblPset__measureResource button.icon.svelte-33qklv,.content.svelte-33qklv .table_wrapper table .tblPset__description button.icon.svelte-33qklv{opacity:0;transition:opacity 0.15s;color:var(--mono-300)}.content.svelte-33qklv .table_wrapper table .tblPset__measureResource:hover button.icon.svelte-33qklv,.content.svelte-33qklv .table_wrapper table .tblPset__description:hover button.icon.svelte-33qklv{opacity:1}.content.svelte-33qklv .table_wrapper table.svelte-33qklv .slot{display:flex}',
      map: null
    };
    Page5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $session, $$unsubscribe_session;
      let $$unsubscribe_theme;
      $$unsubscribe_session = subscribe(session, (value) => $session = value);
      $$unsubscribe_theme = subscribe(theme, (value) => value);
      let { data } = $$props;
      let updateModal, updateData = {};
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css15);
      let $$settled;
      let $$rendered;
      do {
        $$settled = true;
        {
          (() => {
            if (!$session) {
              goto("./login");
            }
          })();
        }
        $$rendered = `${validate_component(Update, "Update").$$render(
          $$result,
          { data: updateData, this: updateModal },
          {
            this: ($$value) => {
              updateModal = $$value;
              $$settled = false;
            }
          },
          {}
        )} ${`<div class="loading svelte-33qklv">${`${``}`}</div>`}`;
      } while (!$$settled);
      $$unsubscribe_session();
      $$unsubscribe_theme();
      return $$rendered;
    });
  }
});

// .svelte-kit/output/server/nodes/11.js
var __exports12 = {};
__export(__exports12, {
  component: () => component11,
  fonts: () => fonts12,
  imports: () => imports12,
  index: () => index12,
  server: () => page_server_exports3,
  server_id: () => server_id7,
  stylesheets: () => stylesheets12
});
var index12, component_cache11, component11, server_id7, imports12, stylesheets12, fonts12;
var init__12 = __esm({
  ".svelte-kit/output/server/nodes/11.js"() {
    init_page_server3();
    index12 = 11;
    component11 = async () => component_cache11 ?? (component_cache11 = (await Promise.resolve().then(() => (init_page_svelte5(), page_svelte_exports5))).default);
    server_id7 = "src/routes/(main)/ifcsg/+page.server.js";
    imports12 = ["_app/immutable/nodes/11.09bbd8c8.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/helper.a19e06e9.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/preload-helper.a4192956.js", "_app/immutable/chunks/dayjs.min.711fbee9.js", "_app/immutable/chunks/index.cb398640.js", "_app/immutable/chunks/Tooltip.342119e2.js", "_app/immutable/chunks/index.aead3cc0.js", "_app/immutable/chunks/supabase.store.eea9b4ba.js", "_app/immutable/chunks/navigation.54a97f74.js", "_app/immutable/chunks/singletons.1311b0c2.js", "_app/immutable/chunks/paths.3682a10a.js", "_app/immutable/chunks/Modal.674a565a.js", "_app/immutable/chunks/notify.store.1d2474ed.js"];
    stylesheets12 = ["_app/immutable/assets/11.64ca35bd.css", "_app/immutable/assets/WaterfallSingle.0c89d209.css"];
    fonts12 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/ifcsg_old/_page.svelte.js
var page_svelte_exports6 = {};
__export(page_svelte_exports6, {
  default: () => Page6
});
var searchValue, css$18, Loading, css16, Page6;
var init_page_svelte6 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/ifcsg_old/_page.svelte.js"() {
    init_ssr();
    init_theme_store();
    init_index2();
    init_functions();
    init_helper2();
    searchValue = writable(0);
    css$18 = {
      code: "body.overflow-hidden{overflow-y:hidden}.loading.svelte-90jqxl.svelte-90jqxl{background-color:rgba(var(--bg-blur-alt), 0.95);display:flex;justify-content:center;align-items:center;z-index:10;position:fixed;left:0;width:100%;height:100%;padding-inline:1rem;display:flex}@supports (backdrop-filter: blur(4px)){.loading.svelte-90jqxl.svelte-90jqxl{background-color:rgba(var(--bg-blur-alt), 0.75);backdrop-filter:blur(4px)}}.icon.svelte-90jqxl.svelte-90jqxl{grid-column:2;display:flex;justify-content:center;margin-top:-100px}.icon.svelte-90jqxl .lds-ellipsis.svelte-90jqxl{position:relative;display:inline-block;width:80px;height:80px}.icon.svelte-90jqxl .lds-ellipsis div.svelte-90jqxl{position:absolute;top:33px;width:13px;height:13px;border-radius:50%;background-color:var(--main);animation-timing-function:cubic-bezier(0, 1, 1, 0)}.icon.svelte-90jqxl .lds-ellipsis div.svelte-90jqxl:nth-child(1){left:8px;animation:svelte-90jqxl-lds-ellipsis1 0.6s infinite}.icon.svelte-90jqxl .lds-ellipsis div.svelte-90jqxl:nth-child(2){left:8px;animation:svelte-90jqxl-lds-ellipsis2 0.6s infinite}.icon.svelte-90jqxl .lds-ellipsis div.svelte-90jqxl:nth-child(3){left:32px;animation:svelte-90jqxl-lds-ellipsis2 0.6s infinite}.icon.svelte-90jqxl .lds-ellipsis div.svelte-90jqxl:nth-child(4){left:56px;animation:svelte-90jqxl-lds-ellipsis3 0.6s infinite}@keyframes svelte-90jqxl-lds-ellipsis1{0%{transform:scale(0)}100%{transform:scale(1)}}@keyframes svelte-90jqxl-lds-ellipsis3{0%{transform:scale(1)}100%{transform:scale(0)}}@keyframes svelte-90jqxl-lds-ellipsis2{0%{transform:translate(0, 0)}100%{transform:translate(24px, 0)}}",
      map: null
    };
    Loading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      onDestroy(() => {
        document.body.classList.remove("overflow-hidden");
      });
      $$result.css.add(css$18);
      return `<div class="loading svelte-90jqxl" data-svelte-h="svelte-cctf2d"><div class="icon svelte-90jqxl"><div class="lds-ellipsis svelte-90jqxl"><div class="svelte-90jqxl"></div> <div class="svelte-90jqxl"></div> <div class="svelte-90jqxl"></div> <div class="svelte-90jqxl"></div></div></div> </div>`;
    });
    css16 = {
      code: '.sidebar.svelte-1uyf08b.svelte-1uyf08b{position:sticky;top:70px;height:calc(100svh - 70px);overflow-y:auto;border-right:1px solid var(--grey-lighter)}.content.svelte-1uyf08b.svelte-1uyf08b{padding-top:2rem;margin-inline:auto;width:1100px;min-height:100vh;padding-bottom:100px}.content.svelte-1uyf08b .doc.svelte-1uyf08b{display:flex;flex-direction:column;gap:2rem}.content.svelte-1uyf08b .doc .loadmore.svelte-1uyf08b{padding-top:2rem;display:flex;flex-direction:column;align-items:center;width:100%;gap:0.5rem}.content.svelte-1uyf08b .doc .loadmore span.svelte-1uyf08b{font-size:0.875rem;color:var(--main-light)}.content.svelte-1uyf08b .doc .loadmore button.svelte-1uyf08b{width:fit-content;padding-inline:4rem}.content.svelte-1uyf08b .card.svelte-1uyf08b{padding:2rem;display:grid;gap:0.5rem;border-radius:0.5rem;background-color:var(--bg-alt)}.content.svelte-1uyf08b .card .title.svelte-1uyf08b{font-size:1.25rem;color:var(--accent);font-weight:600;padding-bottom:1rem}.content.svelte-1uyf08b .card .description.svelte-1uyf08b{display:flex;align-items:center;padding-block:1rem;font-size:1rem;position:relative;display:flex;gap:0.5rem;color:var(--main-light)}.content.svelte-1uyf08b .card .description.svelte-1uyf08b::before{content:"";display:block;width:3px;flex-shrink:0;height:calc(100% + 1rem);background-color:var(--accent)}.content.svelte-1uyf08b .table_wrapper.svelte-1uyf08b{margin-top:1rem;overflow-y:hidden;overflow-x:auto;border-radius:0.5rem}@media screen and (max-width: 600px){.content.svelte-1uyf08b .table_wrapper.svelte-1uyf08b{width:calc(100vw - 4rem)}}.content.svelte-1uyf08b .table_wrapper table.svelte-1uyf08b{width:100%;table-layout:auto;border-collapse:collapse;background-color:var(--bg-p)}.content.svelte-1uyf08b .table_wrapper table th.svelte-1uyf08b{font-size:14px;font-weight:400}.content.svelte-1uyf08b .table_wrapper table.light th.svelte-1uyf08b{background-color:#f4f6f6}.content.svelte-1uyf08b .table_wrapper table.light th.svelte-1uyf08b,.content.svelte-1uyf08b .table_wrapper table.light td.svelte-1uyf08b{border:1px solid var(--grey-lightest)}.content.svelte-1uyf08b .table_wrapper table.light tbody tr:hover td.svelte-1uyf08b{background-color:rgba(179, 204, 224, 0.25)}.content.svelte-1uyf08b .table_wrapper table.dark th.svelte-1uyf08b{background-color:#292e35}.content.svelte-1uyf08b .table_wrapper table.dark th.svelte-1uyf08b,.content.svelte-1uyf08b .table_wrapper table.dark td.svelte-1uyf08b{border:1px solid var(--grey-lighter)}.content.svelte-1uyf08b .table_wrapper table.dark tbody tr:hover td.svelte-1uyf08b{background-color:rgba(39, 92, 139, 0.25)}.content.svelte-1uyf08b .table_wrapper table th.svelte-1uyf08b:first-child,.content.svelte-1uyf08b .table_wrapper table td.svelte-1uyf08b:first-child{border-left:none}.content.svelte-1uyf08b .table_wrapper table th.svelte-1uyf08b:last-child,.content.svelte-1uyf08b .table_wrapper table td.svelte-1uyf08b:last-child{border-right:none}.content.svelte-1uyf08b .table_wrapper table tr:first-child th.svelte-1uyf08b{border-top:none}.content.svelte-1uyf08b .table_wrapper table tr:last-child td.svelte-1uyf08b{border-bottom:none}.content.svelte-1uyf08b .table_wrapper table td.svelte-1uyf08b{font-size:0.875rem}.content.svelte-1uyf08b .table_wrapper table td div.svelte-1uyf08b{padding-block:0.25rem;padding-inline:0.5rem;display:flex;width:fit-content;white-space:break-spaces;gap:2px;flex-wrap:wrap;width:100%}.content.svelte-1uyf08b .table_wrapper table tr.headertitle th div.svelte-1uyf08b{padding-block:1rem;padding-inline:0.5rem;display:flex;justify-content:center;font-size:1rem;font-weight:500}.content.svelte-1uyf08b .table_wrapper table tr.header th div.svelte-1uyf08b{padding-block:0.25rem;padding-inline:0.5rem;display:flex;font-weight:600}.content.svelte-1uyf08b .table_wrapper table tr td.svelte-1uyf08b:first-child{width:200px}.content.svelte-1uyf08b .table_wrapper table tr td.svelte-1uyf08b:nth-child(2){width:150px}.content.svelte-1uyf08b .table_wrapper table tr td.svelte-1uyf08b:nth-child(3){width:200px}.content.svelte-1uyf08b .table_wrapper table tr td.svelte-1uyf08b:nth-child(4){width:180px}',
      map: null
    };
    Page6 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_searchValue;
      let $$unsubscribe_theme;
      $$unsubscribe_searchValue = subscribe(searchValue, (value) => value);
      $$unsubscribe_theme = subscribe(theme, (value) => value);
      $$result.css.add(css16);
      $$unsubscribe_searchValue();
      $$unsubscribe_theme();
      return `${``} ${`${validate_component(Loading, "Loading").$$render($$result, {}, {}, {})} `}l`;
    });
  }
});

// .svelte-kit/output/server/nodes/12.js
var __exports13 = {};
__export(__exports13, {
  component: () => component12,
  fonts: () => fonts13,
  imports: () => imports13,
  index: () => index13,
  stylesheets: () => stylesheets13
});
var index13, component_cache12, component12, imports13, stylesheets13, fonts13;
var init__13 = __esm({
  ".svelte-kit/output/server/nodes/12.js"() {
    index13 = 12;
    component12 = async () => component_cache12 ?? (component_cache12 = (await Promise.resolve().then(() => (init_page_svelte6(), page_svelte_exports6))).default);
    imports13 = ["_app/immutable/nodes/12.5e81796f.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/globals.7f7f1b26.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/search.store.a9df220f.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/helper.a19e06e9.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/preload-helper.a4192956.js"];
    stylesheets13 = ["_app/immutable/assets/12.9c494210.css"];
    fonts13 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/login/_page.svelte.js
var page_svelte_exports7 = {};
__export(page_svelte_exports7, {
  default: () => Page7
});
var css$19, Auth, css17, Page7;
var init_page_svelte7 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/login/_page.svelte.js"() {
    init_ssr();
    init_Icon();
    init_supabase_store();
    init_navigation();
    init_helper2();
    init_stores();
    css$19 = {
      code: '.auth.svelte-14ard1p.svelte-14ard1p{width:400px;display:flex;height:fit-content;flex-direction:column;gap:1rem}@media screen and (max-width: 600px){.auth.svelte-14ard1p.svelte-14ard1p{width:100%}}.auth.svelte-14ard1p h2.svelte-14ard1p{margin-top:0}.auth.svelte-14ard1p .errorMessage.svelte-14ard1p{background-color:rgba(233, 104, 106, 0.75);padding:1rem;color:var(--main-alt);font-size:0.875rem;font-weight:300;border-radius:0.5rem}.auth.svelte-14ard1p input.svelte-14ard1p{width:100%;padding-block:0.75rem}.auth.svelte-14ard1p button.svelte-14ard1p{padding-block:0.75rem}.auth.svelte-14ard1p button.buttonWithIcon.svelte-14ard1p{display:flex;justify-content:flex-start}.auth.svelte-14ard1p button.buttonWithIcon .icon.svelte-14ard1p{width:40px;display:flex;justify-content:flex-start}.auth.svelte-14ard1p button.buttonWithIcon span.svelte-14ard1p{display:flex;justify-content:center;align-items:center;width:100%;margin-left:-40px}.auth.svelte-14ard1p button.link.svelte-14ard1p{font-size:0.875rem}.auth.svelte-14ard1p .inline.svelte-14ard1p{margin-top:0;display:inline;color:var(--mono-400)}.auth.svelte-14ard1p .inline button.svelte-14ard1p{display:inline;padding:0;font-size:1rem}.auth.svelte-14ard1p .OTP.svelte-14ard1p{display:flex;position:relative;justify-content:center;align-items:center}.auth.svelte-14ard1p .OTP input.svelte-14ard1p{padding-block:0.5rem !important;letter-spacing:8px;font-size:1.25rem;text-align:center}.auth.svelte-14ard1p .OTP.placeholder.svelte-14ard1p::after{color:var(--mono-400);content:"Enter OTP";position:absolute;pointer-events:none}',
      map: null
    };
    Auth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $session, $$unsubscribe_session;
      let $$unsubscribe_supabase;
      let $page, $$unsubscribe_page;
      $$unsubscribe_session = subscribe(session, (value) => $session = value);
      $$unsubscribe_supabase = subscribe(supabase, (value) => value);
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      let emailfield, email;
      const dispatch = createEventDispatcher();
      const redirect2 = (() => {
        let redirectPath = $page.url.searchParams.get("redirect") || $page.url.pathname.replace("/", "");
        if (redirectPath == "login") {
          redirectPath = "";
        }
        return `/${redirectPath}`;
      })();
      $$result.css.add(css$19);
      {
        (() => {
          if ($session) {
            dispatch("success");
            console.log("redirect to", redirect2);
            goto(redirect2);
          }
        })();
      }
      $$unsubscribe_session();
      $$unsubscribe_supabase();
      $$unsubscribe_page();
      return `<div class="auth svelte-14ard1p">${`<h2 class="svelte-14ard1p" data-svelte-h="svelte-xd6exf">Log in</h2> ${``} ${`<input type="email" placeholder="Email Address" class="svelte-14ard1p"${add_attribute("this", emailfield, 0)}${add_attribute("value", email, 0)}> <button class="alt buttonWithIcon svelte-14ard1p" ${""}><div class="icon svelte-14ard1p">${`${validate_component(Icon, "Icon").$$render($$result, { icon: "carbon:email", width: "20" }, {}, {})}`}</div> <span class="svelte-14ard1p" data-svelte-h="svelte-1iv6ibj">Continue With Email</span></button> <button class="link svelte-14ard1p" data-svelte-h="svelte-13p7ovx">Use password</button>`}`} </div>`;
    });
    css17 = {
      code: ".login.svelte-nkzo{grid-column:1/-1;width:100%;display:flex;justify-content:center;margin-top:200px}",
      map: null
    };
    Page7 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css17);
      return `<div class="login svelte-nkzo">${validate_component(Auth, "Login").$$render($$result, {}, {}, {})} </div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/13.js
var __exports14 = {};
__export(__exports14, {
  component: () => component13,
  fonts: () => fonts14,
  imports: () => imports14,
  index: () => index14,
  stylesheets: () => stylesheets14
});
var index14, component_cache13, component13, imports14, stylesheets14, fonts14;
var init__14 = __esm({
  ".svelte-kit/output/server/nodes/13.js"() {
    index14 = 13;
    component13 = async () => component_cache13 ?? (component_cache13 = (await Promise.resolve().then(() => (init_page_svelte7(), page_svelte_exports7))).default);
    imports14 = ["_app/immutable/nodes/13.64b29207.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/Auth.b0457e6a.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/supabase.store.eea9b4ba.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/preload-helper.a4192956.js", "_app/immutable/chunks/navigation.54a97f74.js", "_app/immutable/chunks/singletons.1311b0c2.js", "_app/immutable/chunks/paths.3682a10a.js", "_app/immutable/chunks/helper.a19e06e9.js", "_app/immutable/chunks/stores.d1a9bb22.js"];
    stylesheets14 = ["_app/immutable/assets/13.da81f263.css", "_app/immutable/assets/Auth.49af9d29.css"];
    fonts14 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/modellingguide/_page.svelte.js
var page_svelte_exports8 = {};
__export(page_svelte_exports8, {
  default: () => Page8
});
var Page8;
var init_page_svelte8 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/modellingguide/_page.svelte.js"() {
    init_ssr();
    Page8 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<h1 data-svelte-h="svelte-74beqv">Model Checker Modelling Guide</h1> <span data-svelte-h="svelte-hthhyy">This modelling guide is work in progress. Content will continuously updated.</span>`;
    });
  }
});

// .svelte-kit/output/server/nodes/14.js
var __exports15 = {};
__export(__exports15, {
  component: () => component14,
  fonts: () => fonts15,
  imports: () => imports15,
  index: () => index15,
  stylesheets: () => stylesheets15
});
var index15, component_cache14, component14, imports15, stylesheets15, fonts15;
var init__15 = __esm({
  ".svelte-kit/output/server/nodes/14.js"() {
    index15 = 14;
    component14 = async () => component_cache14 ?? (component_cache14 = (await Promise.resolve().then(() => (init_page_svelte8(), page_svelte_exports8))).default);
    imports15 = ["_app/immutable/nodes/14.311d50a7.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js"];
    stylesheets15 = [];
    fonts15 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/modellingguide/_slug_/_page.server.js
var page_server_exports4 = {};
__export(page_server_exports4, {
  load: () => load9
});
async function load9({ params, locals: { supabase: supabase2 } }) {
  const { data: guides } = await supabase2.from("modellingGuide").select();
  const guide = guides.filter((x) => x.slug == params.slug)[0];
  if (!guide) {
    throw error2(404, {
      message: "Not found"
    });
  }
  const { data: url, error: error2 } = await supabase2.storage.from("public").getPublicUrl(`modellingGuide/${guide.id}/doc.json`);
  return { guide, guideUrl: url.publicUrl };
}
var init_page_server4 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/modellingguide/_slug_/_page.server.js"() {
  }
});

// node_modules/.pnpm/base64-arraybuffer@1.0.2/node_modules/base64-arraybuffer/dist/base64-arraybuffer.es5.js
var chars3, lookup, i;
var init_base64_arraybuffer_es5 = __esm({
  "node_modules/.pnpm/base64-arraybuffer@1.0.2/node_modules/base64-arraybuffer/dist/base64-arraybuffer.es5.js"() {
    chars3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
    for (i = 0; i < chars3.length; i++) {
      lookup[chars3.charCodeAt(i)] = i;
    }
  }
});

// .svelte-kit/output/server/entries/pages/(main)/modellingguide/_slug_/_page.svelte.js
var page_svelte_exports9 = {};
__export(page_svelte_exports9, {
  default: () => Page9
});
function parseHTML(html) {
  html = html.replace(/(?<!<p><br><\/p>)<p><br><\/p>(?!<p><br><\/p>)/g, "");
  return html;
}
var css$110, Awaiting, css18, Page9;
var init_page_svelte9 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/modellingguide/_slug_/_page.svelte.js"() {
    init_ssr();
    init_functions();
    init_theme_store();
    init_aside_store();
    init_Icon();
    init_helper2();
    init_base64_arraybuffer_es5();
    css$110 = {
      code: ".container.svelte-1yk0icn.svelte-1yk0icn{width:100%;height:100%;position:fixed;top:0;left:0;z-index:500;display:flex;justify-content:center;align-items:center;background-color:rgba(var(--bg-blur-alt), 0.95)}@supports (backdrop-filter: blur(4px)){.container.svelte-1yk0icn.svelte-1yk0icn{background-color:rgba(var(--bg-blur-alt), 0.75);backdrop-filter:blur(4px)}}.container.svelte-1yk0icn .loader.svelte-1yk0icn{display:flex;flex-direction:column;gap:0.5rem;align-items:center;justify-content:center}.container.svelte-1yk0icn .loader .icon.svelte-1yk0icn{color:var(--grey-light)}.container.svelte-1yk0icn .loader span.svelte-1yk0icn{text-align:center;font-size:1.5rem;color:var(--main-light)}",
      map: null
    };
    Awaiting = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { message } = $$props;
      if (message == true) {
        message = "Loading";
      }
      if ($$props.message === void 0 && $$bindings.message && message !== void 0)
        $$bindings.message(message);
      $$result.css.add(css$110);
      return `<div class="container svelte-1yk0icn"><div class="loader svelte-1yk0icn"><div class="icon svelte-1yk0icn">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          icon: "svg-spinners:blocks-shuffle-3",
          height: "96"
        },
        {},
        {}
      )}</div> <span class="svelte-1yk0icn">${escape(message)} ...</span></div> </div>`;
    });
    css18 = {
      code: ".doc.svelte-rihqnq h1.svelte-rihqnq{margin:0;padding-bottom:1rem}",
      map: null
    };
    Page9 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_listOfGuides;
      let $theme, $$unsubscribe_theme;
      $$unsubscribe_listOfGuides = subscribe(listOfGuides, (value) => value);
      $$unsubscribe_theme = subscribe(theme, (value) => $theme = value);
      let { data } = $$props;
      let { supabase: supabase2, guide, session: session2 } = data;
      let content;
      let loading;
      const cache = /* @__PURE__ */ new Map();
      async function onChange() {
        guide = data.guide;
        if (!cache.has(guide.id)) {
          loading = true;
          const resp = await fetch(`/modellingguide/${guide.slug}?url=${data.guideUrl}`);
          content = await resp.json();
          content = content;
          cache.set(content.id, content);
          loading = false;
        } else {
          content = cache.get(guide.id);
        }
      }
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css18);
      let $$settled;
      let $$rendered;
      do {
        $$settled = true;
        {
          onChange();
        }
        $$rendered = `${loading ? `${validate_component(Awaiting, "Awaiting").$$render($$result, { message: loading }, {}, {})}` : ``} ${session2 ? `<div class="buttonRows">${`<button data-svelte-h="svelte-l830zo">Edit</button>`}</div>` : ``} ${`<div class="${"doc " + escape($theme, true) + " svelte-rihqnq"}"><h1 class="svelte-rihqnq">${escape(content ? content.title : guide.title)}</h1> ${content && content.html ? `<!-- HTML_TAG_START -->${parseHTML(content.html)}<!-- HTML_TAG_END -->` : ``}</div>`}`;
      } while (!$$settled);
      $$unsubscribe_listOfGuides();
      $$unsubscribe_theme();
      return $$rendered;
    });
  }
});

// .svelte-kit/output/server/nodes/15.js
var __exports16 = {};
__export(__exports16, {
  component: () => component15,
  fonts: () => fonts16,
  imports: () => imports16,
  index: () => index16,
  server: () => page_server_exports4,
  server_id: () => server_id8,
  stylesheets: () => stylesheets16
});
var index16, component_cache15, component15, server_id8, imports16, stylesheets16, fonts16;
var init__16 = __esm({
  ".svelte-kit/output/server/nodes/15.js"() {
    init_page_server4();
    index16 = 15;
    component15 = async () => component_cache15 ?? (component_cache15 = (await Promise.resolve().then(() => (init_page_svelte9(), page_svelte_exports9))).default);
    server_id8 = "src/routes/(main)/modellingguide/[slug]/+page.server.js";
    imports16 = ["_app/immutable/nodes/15.f748a8fc.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/globals.7f7f1b26.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/navigation.54a97f74.js", "_app/immutable/chunks/singletons.1311b0c2.js", "_app/immutable/chunks/paths.3682a10a.js", "_app/immutable/chunks/aside.store.56b6926c.js", "_app/immutable/chunks/helper.a19e06e9.js", "_app/immutable/chunks/index.3c4d4caf.js", "_app/immutable/chunks/_commonjsHelpers.725317a4.js", "_app/immutable/chunks/preload-helper.a4192956.js"];
    stylesheets16 = ["_app/immutable/assets/15.0903980a.css"];
    fonts16 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/psets/_page.svelte.js
var page_svelte_exports10 = {};
__export(page_svelte_exports10, {
  default: () => Page10
});
var css19, Page10;
var init_page_svelte10 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/psets/_page.svelte.js"() {
    init_ssr();
    init_theme_store();
    init_functions();
    css19 = {
      code: ".sidebar.svelte-29uh71.svelte-29uh71{position:sticky;top:70px;height:calc(100svh - 70px);overflow-y:auto;border-right:1px solid var(--grey-lighter)}.content.svelte-29uh71.svelte-29uh71{padding-top:2rem;margin-inline:auto;width:1100px;min-height:100vh;padding-bottom:100px}.content.svelte-29uh71 .doc.svelte-29uh71{display:flex;flex-direction:column;gap:2rem}.content.svelte-29uh71 .card.svelte-29uh71{padding:2rem;display:grid;gap:0.5rem;border-radius:0.5rem;background-color:var(--bg-alt)}.content.svelte-29uh71 .card .title.svelte-29uh71{font-size:1.25rem;color:var(--accent);font-weight:600}.content.svelte-29uh71 .table_wrapper.svelte-29uh71{margin-top:1rem;overflow-y:hidden;overflow-x:auto;border-radius:0.5rem}@media screen and (max-width: 600px){.content.svelte-29uh71 .table_wrapper.svelte-29uh71{width:calc(100vw - 4rem)}}.content.svelte-29uh71 table.svelte-29uh71{width:100%;table-layout:auto;border-collapse:collapse;background-color:var(--bg-p)}.content.svelte-29uh71 table th.svelte-29uh71{font-size:14px;font-weight:400}.content.svelte-29uh71 table.light th.svelte-29uh71{background-color:#f4f6f6}.content.svelte-29uh71 table.light th.svelte-29uh71,.content.svelte-29uh71 table.light td.svelte-29uh71{border:1px solid var(--grey-lightest)}.content.svelte-29uh71 table.light tbody tr:hover td.svelte-29uh71{background-color:rgba(179, 204, 224, 0.25)}.content.svelte-29uh71 table.dark th.svelte-29uh71{background-color:#292e35}.content.svelte-29uh71 table.dark th.svelte-29uh71,.content.svelte-29uh71 table.dark td.svelte-29uh71{border:1px solid var(--grey-lighter)}.content.svelte-29uh71 table.dark tbody tr:hover td.svelte-29uh71{background-color:rgba(39, 92, 139, 0.25)}.content.svelte-29uh71 table th.svelte-29uh71:first-child,.content.svelte-29uh71 table td.svelte-29uh71:first-child{border-left:none}.content.svelte-29uh71 table th.svelte-29uh71:last-child,.content.svelte-29uh71 table td.svelte-29uh71:last-child{border-right:none}.content.svelte-29uh71 table tr:first-child th.svelte-29uh71{border-top:none}.content.svelte-29uh71 table tr:last-child td.svelte-29uh71{border-bottom:none}.content.svelte-29uh71 table td.svelte-29uh71{font-size:0.875rem}.content.svelte-29uh71 table td div.svelte-29uh71{padding-block:0.25rem;padding-inline:0.5rem;display:flex;width:fit-content;white-space:break-spaces;gap:2px;flex-wrap:wrap;width:100%}.content.svelte-29uh71 table tr.headertitle th div.svelte-29uh71{padding-block:1rem;padding-inline:0.5rem;display:flex;justify-content:center;font-size:1rem;font-weight:500}.content.svelte-29uh71 table tr.header th div.svelte-29uh71{padding-block:0.25rem;padding-inline:0.5rem;display:flex;font-weight:600}.content.svelte-29uh71 table tr td.svelte-29uh71:first-child{width:200px}.content.svelte-29uh71 table tr td.svelte-29uh71:nth-child(2){width:150px}.content.svelte-29uh71 table tr td.svelte-29uh71:nth-child(3){width:200px}.content.svelte-29uh71 table tr td.svelte-29uh71:nth-child(4){width:180px}",
      map: null
    };
    Page10 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_theme;
      $$unsubscribe_theme = subscribe(theme, (value) => value);
      $$result.css.add(css19);
      $$unsubscribe_theme();
      return `${``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/16.js
var __exports17 = {};
__export(__exports17, {
  component: () => component16,
  fonts: () => fonts17,
  imports: () => imports17,
  index: () => index17,
  stylesheets: () => stylesheets17
});
var index17, component_cache16, component16, imports17, stylesheets17, fonts17;
var init__17 = __esm({
  ".svelte-kit/output/server/nodes/16.js"() {
    index17 = 16;
    component16 = async () => component_cache16 ?? (component_cache16 = (await Promise.resolve().then(() => (init_page_svelte10(), page_svelte_exports10))).default);
    imports17 = ["_app/immutable/nodes/16.349d3a9b.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/globals.7f7f1b26.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/functions.93e96281.js"];
    stylesheets17 = ["_app/immutable/assets/16.36db8345.css"];
    fonts17 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/spacename/_page.svelte.js
var page_svelte_exports11 = {};
__export(page_svelte_exports11, {
  default: () => Page11
});
var Page11;
var init_page_svelte11 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/spacename/_page.svelte.js"() {
    init_ssr();
    Page11 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `&lt;PLACEHOLDER&gt; <br>
\u2190 Navigate with sidebar \u2190 <br>
&lt;PLACEHOLDER&gt;`;
    });
  }
});

// .svelte-kit/output/server/nodes/17.js
var __exports18 = {};
__export(__exports18, {
  component: () => component17,
  fonts: () => fonts18,
  imports: () => imports18,
  index: () => index18,
  stylesheets: () => stylesheets18
});
var index18, component_cache17, component17, imports18, stylesheets18, fonts18;
var init__18 = __esm({
  ".svelte-kit/output/server/nodes/17.js"() {
    index18 = 17;
    component17 = async () => component_cache17 ?? (component_cache17 = (await Promise.resolve().then(() => (init_page_svelte11(), page_svelte_exports11))).default);
    imports18 = ["_app/immutable/nodes/17.2b3562b8.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js"];
    stylesheets18 = [];
    fonts18 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/spacename/_slug_/_page.js
var page_exports = {};
__export(page_exports, {
  load: () => load10
});
async function load10({ url }) {
  const path = url.pathname.split(/\//).pop();
  const spaces = spaceNameJson.spaceName;
  const result = spaces.filter((x) => {
    const cat = x.category.replace(/\n/, "").replace(/[\/,]/g, "").replace(/\s+/g, "-").toLowerCase();
    if (cat === path) {
      return x;
    }
  });
  return { spaces: result };
}
var init_page = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/spacename/_slug_/_page.js"() {
    init_data_space_ot_pdt();
  }
});

// .svelte-kit/output/server/entries/pages/(main)/spacename/_slug_/_page.svelte.js
var page_svelte_exports12 = {};
__export(page_svelte_exports12, {
  default: () => Page12
});
function matchDictionary(dictionary2, string) {
  return dictionary2.find((obj) => {
    if (Array.isArray(obj.name)) {
      const arr = obj.name.map((x) => x.toLowerCase());
      const exists = arr.includes(string.toLowerCase());
      return exists;
    } else {
      return obj.name.toLowerCase() === string.toLowerCase();
    }
  });
}
function convertStringToArray(inputString) {
  const pattern2 = /\{\{([^}]+)\}\}/gi;
  let match;
  const result = [];
  let lastIndex = 0;
  const dict = get_store_value(dictionary);
  while (match = pattern2.exec(inputString)) {
    if (match.index > lastIndex) {
      result.push({ type: "string", content: inputString.slice(lastIndex, match.index).trim() });
    }
    const data = matchDictionary(dict, match[1]);
    result.push({ type: "data", content: match[1], data });
    lastIndex = pattern2.lastIndex;
  }
  if (lastIndex < inputString.length) {
    result.push({ type: "string", content: inputString.slice(lastIndex).trim() });
  }
  return result;
}
function generateID2(length) {
  if (!length) {
    length = 8;
  }
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  return id;
}
var dictionary, css$3, Popup, css$23, Word, css$111, WaterfallSingle, spacesDictionary, css20, Page12;
var init_page_svelte12 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/spacename/_slug_/_page.svelte.js"() {
    init_ssr();
    init_Icon();
    init_theme_store();
    init_index2();
    dictionary = writable([]);
    css$3 = {
      code: '.csd-tt__popup.svelte-1kgjqc0.svelte-1kgjqc0{position:fixed;left:var(--popup_left);top:var(--popup_top);z-index:5000;max-width:400px;background-color:var(--background-secondary);padding:1rem;border-radius:0.5rem;display:flex;gap:1rem;flex-direction:column;border:1px solid var(--mono-200);box-shadow:0 2px 5px color-mix(in srgb, var(--mono-600) 12%, transparent)}.csd-tt__popup.csd-tt__fade.svelte-1kgjqc0.svelte-1kgjqc0::after{content:"";border-radius:0.5rem;position:absolute;width:100%;height:100%;top:0;left:0;background-color:var(--background-secondary);opacity:0.25}.csd-tt__popup.svelte-1kgjqc0 button.csd-tt__popup__close.svelte-1kgjqc0{display:flex;justify-content:center;align-items:center;background-color:transparent;padding:0.25rem;width:24px;height:24px;border-radius:100px;position:absolute;top:0.25rem;right:0.25rem}.csd-tt__popup.svelte-1kgjqc0 button.csd-tt__popup__close .csd-tt__popup__close__icon.svelte-1kgjqc0{width:100%;height:100%;display:flex;justify-content:center;align-items:center;user-select:none;pointer-events:none}.csd-tt__popup.svelte-1kgjqc0 .csd-tt__popup__label.svelte-1kgjqc0{font-weight:600;font-size:1.25rem;text-transform:capitalize}.csd-tt__popup.svelte-1kgjqc0 .csd-tt__popup__content.svelte-1kgjqc0{position:relative;word-wrap:normal;white-space:break-spaces}.csd-tt__button-unstyled.svelte-1kgjqc0.svelte-1kgjqc0{margin:0;padding:0;border:none;background-color:transparent;color:inherit;font-family:inherit;font-size:inherit;cursor:pointer;box-shadow:none;outline:none;transition:none;display:inline-block;font-weight:400;background-color:var(--muted);padding-inline:4px;padding-block:2px;border-radius:4px}.csd-tt__button-unstyled.svelte-1kgjqc0.svelte-1kgjqc0:hover{background-color:var(--muted)}.csd-tt__button-unstyled.svelte-1kgjqc0.svelte-1kgjqc0:focus{outline:0 !important}',
      map: null
    };
    Popup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { data } = $$props;
      const tooltip_data = convertStringToArray(data.tooltip);
      const id = generateID2();
      createEventDispatcher();
      let comp, popup, popup_left = 0, popup_top = 0;
      function getId() {
        return id;
      }
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      if ($$props.getId === void 0 && $$bindings.getId && getId !== void 0)
        $$bindings.getId(getId);
      $$result.css.add(css$3);
      let $$settled;
      let $$rendered;
      do {
        $$settled = true;
        $$rendered = ` <div${add_attribute("id", id, 0)} class="${["csd-tt__popup svelte-1kgjqc0", ""].join(" ").trim()}" style="${"--popup_top:" + escape(popup_top, true) + "px; --popup_left:" + escape(popup_left, true) + "px"}"${add_attribute("this", popup, 0)}><button class="csd-tt__button-unstyled csd-tt__popup__close svelte-1kgjqc0"><div class="csd-tt__popup__close__icon svelte-1kgjqc0">${validate_component(Icon, "Icon").$$render(
          $$result,
          {
            icon: "material-symbols:close",
            height: "24"
          },
          {},
          {}
        )}</div></button>  <span class="csd-tt__popup__label svelte-1kgjqc0">${escape(data.title)}</span> <div class="csd-tt__popup__content svelte-1kgjqc0">${each(tooltip_data, (obj) => {
          return `${obj.type == "string" ? `${escape(obj.content)}\xA0` : `${obj.type == "data" ? `${validate_component(Word, "Word").$$render(
            $$result,
            {
              data: obj.data,
              content: obj.content,
              this: comp
            },
            {
              this: ($$value) => {
                comp = $$value;
                $$settled = false;
              }
            },
            {}
          )}` : ``}`}`;
        })}</div> </div>`;
      } while (!$$settled);
      return $$rendered;
    });
    css$23 = {
      code: ".csd-tt__button-unstyled.svelte-1mkh0hd{margin:0;padding:0;border:none;background-color:transparent;color:inherit;font-family:inherit;font-size:inherit;cursor:pointer;box-shadow:none;outline:none;transition:none;display:inline-block;font-weight:400;background-color:var(--muted);padding-inline:4px;border-radius:4px;font-family:var(--monospace), monospace}.csd-tt__button-unstyled.svelte-1mkh0hd:hover{background-color:var(--muted)}.csd-tt__button-unstyled.svelte-1mkh0hd:focus{outline:0 !important}.csd-tt__button-nostyle.svelte-1mkh0hd{background-color:transparent}",
      map: null
    };
    Word = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      createEventDispatcher();
      let { data } = $$props;
      let { content } = $$props;
      let { slotted = false } = $$props;
      let show;
      let popup;
      function closeAll() {
        show = false;
      }
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      if ($$props.content === void 0 && $$bindings.content && content !== void 0)
        $$bindings.content(content);
      if ($$props.slotted === void 0 && $$bindings.slotted && slotted !== void 0)
        $$bindings.slotted(slotted);
      if ($$props.closeAll === void 0 && $$bindings.closeAll && closeAll !== void 0)
        $$bindings.closeAll(closeAll);
      $$result.css.add(css$23);
      let $$settled;
      let $$rendered;
      do {
        $$settled = true;
        $$rendered = `<button class="${[
          "csd-tt__button-unstyled svelte-1mkh0hd",
          ""
        ].join(" ").trim()}">${slotted ? `${slots.default ? slots.default({}) : ``}` : `${escape(content)}`}</button> ${show ? `${validate_component(Popup, "Popup").$$render(
          $$result,
          { data, this: popup },
          {
            this: ($$value) => {
              popup = $$value;
              $$settled = false;
            }
          },
          {}
        )}` : ``}`;
      } while (!$$settled);
      return $$rendered;
    });
    css$111 = {
      code: ".csd-tt__backdrop.svelte-1rapgwf{position:fixed;top:0;left:0;width:100svw;height:100svh;display:flex;justify-content:center;align-items:center;z-index:100;background:color-mix(in srgb, var(--mono-100) 50%, transparent)}",
      map: null
    };
    WaterfallSingle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $dictionary, $$unsubscribe_dictionary;
      $$unsubscribe_dictionary = subscribe(dictionary, (value) => $dictionary = value);
      let { content } = $$props;
      let { slotted = false } = $$props;
      let { data = matchDictionary($dictionary, content) } = $$props;
      let comp;
      if ($$props.content === void 0 && $$bindings.content && content !== void 0)
        $$bindings.content(content);
      if ($$props.slotted === void 0 && $$bindings.slotted && slotted !== void 0)
        $$bindings.slotted(slotted);
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css$111);
      let $$settled;
      let $$rendered;
      do {
        $$settled = true;
        $$rendered = `  ${``} ${validate_component(Word, "Word").$$render(
          $$result,
          { data, content, slotted, this: comp },
          {
            this: ($$value) => {
              comp = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `${slots.default ? slots.default({}) : ``}`;
            }
          }
        )}`;
      } while (!$$settled);
      $$unsubscribe_dictionary();
      return $$rendered;
    });
    spacesDictionary = [
      {
        name: "any:spaceName",
        title: "Any Space Name",
        tooltip: "any {{SpaceName}} value in this list except for space name with the same {{occupancy type}} as this field"
      },
      {
        name: [
          "SpaceName",
          "Space Name"
        ],
        title: "SpaceName",
        tooltip: "A property of IfcSpace (SPACE), representing the name of the space."
      },
      {
        name: [
          "Occupancy Type",
          "OccupancyType"
        ],
        title: "OccupancyType",
        tooltip: "To define the purpose for a part of the building intended to be used. Each occupancy type is tagged to a {{Purpose Group}} (PG)"
      },
      {
        name: "Purpose Group",
        title: "Purpose Group",
        tooltip: "Refers to the categorisation of buildings in the fire code, with the aim of specifying relevant fire safety criteria for that building type.\n\nWhere a building is divided into compartments used for different purposes, the purpose group of each compartment shall be determined individually, provided that where the whole or part of a building or compartment is used for more than one purpose, only the main purpose of that building or compartment shall be taken into account in determining into which purpose group it falls."
      }
    ];
    css20 = {
      code: "table.svelte-1vl8nf7.svelte-1vl8nf7.svelte-1vl8nf7{width:100%;font-size:0.875rem}table.svelte-1vl8nf7 tr th.spaceName.svelte-1vl8nf7.svelte-1vl8nf7{width:200px}table.svelte-1vl8nf7 tr th.OccupancyType.svelte-1vl8nf7.svelte-1vl8nf7{width:200px}table.svelte-1vl8nf7 tr th.Remarks.svelte-1vl8nf7.svelte-1vl8nf7{width:auto}table.svelte-1vl8nf7 tr th.FunctionalSpace.svelte-1vl8nf7.svelte-1vl8nf7{width:200px}table.svelte-1vl8nf7 tr th.OccupancyLoad.svelte-1vl8nf7.svelte-1vl8nf7{width:130px}table.svelte-1vl8nf7 tr td.spaceName div button.svelte-1vl8nf7.svelte-1vl8nf7{padding:0;text-align:left;font-size:inherit;justify-content:space-between;width:100%}table.svelte-1vl8nf7 tr td.spaceName div button div.svelte-1vl8nf7.svelte-1vl8nf7{max-width:calc(100% - 1.25rem)}table.svelte-1vl8nf7 tr td.spaceName div button.svelte-1vl8nf7.svelte-1vl8nf7:hover{color:var(--url)}table.svelte-1vl8nf7 tr td.spaceName div.svelte-1vl8nf7 button:hover .icon.svelte-1vl8nf7{opacity:1}table.svelte-1vl8nf7 tr td.spaceName div.svelte-1vl8nf7 button .icon.svelte-1vl8nf7{opacity:0;transition:all 0.15s;color:var(--mono-200)}table.svelte-1vl8nf7 tr td.spaceName div span.svelte-1vl8nf7.svelte-1vl8nf7{font-style:italic}table.svelte-1vl8nf7 tr td.spaceName div.svelte-1vl8nf7 .csd-tt__button-unstyled{padding:2px 4px}table.svelte-1vl8nf7 tr td.OccupancyLoad div.svelte-1vl8nf7.svelte-1vl8nf7{display:block;text-align:center}",
      map: null
    };
    Page12 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $theme, $$unsubscribe_theme;
      $$unsubscribe_theme = subscribe(theme, (value) => $theme = value);
      let { data } = $$props;
      dictionary.set(spacesDictionary);
      function onDataChange() {
        console.log(data.spaces.length);
      }
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css20);
      {
        data.spaceName, onDataChange();
      }
      $$unsubscribe_theme();
      return `<div class="table_wrapper svelte-1vl8nf7"><table class="${escape($theme, true) + " noActionColumn noHover svelte-1vl8nf7"}"><thead data-svelte-h="svelte-10ulh4w"><tr><th class="spaceName svelte-1vl8nf7"><div class="svelte-1vl8nf7">SpaceName</div></th> <th class="OccupancyType svelte-1vl8nf7"><div class="svelte-1vl8nf7">OccupancyType</div></th> <th class="Remarks svelte-1vl8nf7"><div class="svelte-1vl8nf7">Remarks</div></th> <th class="FunctionalSpace svelte-1vl8nf7"><div class="svelte-1vl8nf7">FunctionalSpace</div></th> <th class="OccupancyLoad svelte-1vl8nf7"><div class="svelte-1vl8nf7">OccupancyLoad</div></th></tr></thead> <tbody>${each(data.spaces, (space) => {
        return `<tr><td class="spaceName"><div class="svelte-1vl8nf7">${space.spaceName !== "any" ? `<button class="none noHover svelte-1vl8nf7"><div class="svelte-1vl8nf7">${escape(space.spaceName)}</div> <div class="icon svelte-1vl8nf7">${validate_component(Icon, "Icon").$$render($$result, { icon: "charm:copy", width: 16, hFlip: 1 }, {}, {})}</div> </button>` : `${validate_component(WaterfallSingle, "WaterfallSingle").$$render($$result, { content: "any:spaceName", slotted: true }, {}, {
          default: () => {
            return `<span class="svelte-1vl8nf7">${escape(space.spaceName)}</span> `;
          }
        })}`} </div></td> <td class="OccupancyType"><div class="svelte-1vl8nf7">${space.occupancyType ? `${escape(space.occupancyType)}` : `<span class="svelte-1vl8nf7" data-svelte-h="svelte-yixklt">\u2013</span>`} </div></td> <td><div class="svelte-1vl8nf7">${escape(space.remarks || "\u2013")}</div></td> <td><div class="svelte-1vl8nf7">${escape(space.functionalSpace)}</div></td> <td class="OccupancyLoad"><div class="svelte-1vl8nf7">${escape(space.occupancyLoad)}</div></td> </tr>`;
      })}</tbody></table> </div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/18.js
var __exports19 = {};
__export(__exports19, {
  component: () => component18,
  fonts: () => fonts19,
  imports: () => imports19,
  index: () => index19,
  stylesheets: () => stylesheets19,
  universal: () => page_exports,
  universal_id: () => universal_id2
});
var index19, component_cache18, component18, universal_id2, imports19, stylesheets19, fonts19;
var init__19 = __esm({
  ".svelte-kit/output/server/nodes/18.js"() {
    init_page();
    index19 = 18;
    component18 = async () => component_cache18 ?? (component_cache18 = (await Promise.resolve().then(() => (init_page_svelte12(), page_svelte_exports12))).default);
    universal_id2 = "src/routes/(main)/spacename/[slug]/+page.js";
    imports19 = ["_app/immutable/nodes/18.4e1c7c0c.js", "_app/immutable/chunks/data_space_ot_pdt.64972bc5.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/notify.store.1d2474ed.js", "_app/immutable/chunks/globals.7f7f1b26.js"];
    stylesheets19 = ["_app/immutable/assets/18.dea9ed12.css", "_app/immutable/assets/WaterfallSingle.0c89d209.css"];
    fonts19 = [];
  }
});

// .svelte-kit/output/server/entries/pages/(main)/spacename_old/_page.server.js
var page_server_exports5 = {};
__export(page_server_exports5, {
  load: () => load11
});
async function load11({ locals: { supabase: supabase2 } }) {
  const { data: spacename, error: error2 } = await supabase2.from("spacename").select().order("spaceName");
  return { spaceName: spacename };
}
var init_page_server5 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/spacename_old/_page.server.js"() {
  }
});

// .svelte-kit/output/server/entries/pages/(main)/spacename_old/_page.svelte.js
var page_svelte_exports13 = {};
__export(page_svelte_exports13, {
  default: () => Page13
});
var css21, Page13;
var init_page_svelte13 = __esm({
  ".svelte-kit/output/server/entries/pages/(main)/spacename_old/_page.svelte.js"() {
    init_ssr();
    init_Icon();
    init_theme_store();
    init_supabase_store();
    css21 = {
      code: ".content.svelte-18djixa.svelte-18djixa{grid-column:1/-1;padding-top:2rem;margin-inline:auto;width:1400px;min-height:100vh;padding-bottom:100px}.content.svelte-18djixa .title.svelte-18djixa{display:flex;justify-content:space-between;align-items:center}.content.svelte-18djixa .title button.svelte-18djixa{font-size:14px}.content.svelte-18djixa .table_wrapper.svelte-18djixa{margin-top:1rem;overflow-y:hidden;overflow-x:auto}@media screen and (max-width: 600px){.content.svelte-18djixa .table_wrapper.svelte-18djixa{width:calc(100vw - 4rem)}}.content.svelte-18djixa .table_wrapper table.svelte-18djixa{width:100%;table-layout:auto;border-collapse:collapse;background-color:var(--bg-p)}.content.svelte-18djixa .table_wrapper table.light th.svelte-18djixa{background-color:#f4f6f6}.content.svelte-18djixa .table_wrapper table.light th.svelte-18djixa,.content.svelte-18djixa .table_wrapper table.light td.svelte-18djixa{border:1px solid var(--grey-lightest)}.content.svelte-18djixa .table_wrapper table.light tbody tr:hover td.svelte-18djixa{background-color:rgba(179, 204, 224, 0.25)}.content.svelte-18djixa .table_wrapper table.dark th.svelte-18djixa{background-color:#292e35}.content.svelte-18djixa .table_wrapper table.dark th.svelte-18djixa,.content.svelte-18djixa .table_wrapper table.dark td.svelte-18djixa{border:1px solid var(--grey-lighter)}.content.svelte-18djixa .table_wrapper table.dark tbody tr:hover td.svelte-18djixa{background-color:rgba(39, 92, 139, 0.25)}.content.svelte-18djixa .table_wrapper table th.svelte-18djixa{font-size:14px;font-weight:400}.content.svelte-18djixa .table_wrapper table th div.svelte-18djixa{padding-block:0.5rem;padding-inline:0.5rem;display:flex;font-size:1rem;font-weight:500}.content.svelte-18djixa .table_wrapper table th.svelte-18djixa:first-child{width:200px}.content.svelte-18djixa .table_wrapper table th.svelte-18djixa:nth-child(2){width:200px}.content.svelte-18djixa .table_wrapper table th.svelte-18djixa:nth-child(3){width:300px}.content.svelte-18djixa .table_wrapper table th.svelte-18djixa:nth-last-child(2){border-right:0}.content.svelte-18djixa .table_wrapper table th.svelte-18djixa:last-child{border-left:0}.content.svelte-18djixa .table_wrapper table td div.svelte-18djixa{font-size:15px;padding-block:0.325rem;padding-inline:0.5rem;display:flex;width:fit-content;white-space:break-spaces;gap:2px;flex-wrap:wrap;width:100%}.content.svelte-18djixa .table_wrapper table td div.actions.svelte-18djixa{width:120px;display:flex;gap:0.25rem;justify-content:flex-end}.content.svelte-18djixa .table_wrapper table td div.actions button.svelte-18djixa:hover{color:var(--accent)}.content.svelte-18djixa .table_wrapper table td div.actions button:hover.delete.svelte-18djixa{color:#e9686a}.content.svelte-18djixa .table_wrapper table td.svelte-18djixa:nth-last-child(2){border-right:0}.content.svelte-18djixa .table_wrapper table td.svelte-18djixa:last-child{border-left:0}.content.svelte-18djixa .table_wrapper table td:last-child div.svelte-18djixa{color:var(--main-light)}.newEntry.svelte-18djixa.svelte-18djixa{display:grid;gap:1rem;width:600px}.newEntry.svelte-18djixa .field.svelte-18djixa{display:flex;gap:1rem;align-items:flex-start}.newEntry.svelte-18djixa .field div.svelte-18djixa{padding-top:0.5rem;display:inline-flex;width:120px;flex-shrink:0}.newEntry.svelte-18djixa .field input.svelte-18djixa{width:100%}.newEntry.svelte-18djixa .field textarea.svelte-18djixa{width:100%;min-height:80px;resize:vertical;max-height:300px}.newEntry.svelte-18djixa .buttons.svelte-18djixa{display:flex;flex-direction:row-reverse;gap:0.5rem}.newEntry.svelte-18djixa .buttons button.svelte-18djixa{min-width:100px}.newEntry.svelte-18djixa .buttons button.warning.svelte-18djixa{margin-right:auto}",
      map: null
    };
    Page13 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_supabase;
      let $session, $$unsubscribe_session;
      let $theme, $$unsubscribe_theme;
      $$unsubscribe_supabase = subscribe(supabase, (value) => value);
      $$unsubscribe_session = subscribe(session, (value) => $session = value);
      $$unsubscribe_theme = subscribe(theme, (value) => $theme = value);
      let { data } = $$props;
      let spaceNames = data.spaceName;
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css21);
      $$unsubscribe_supabase();
      $$unsubscribe_session();
      $$unsubscribe_theme();
      return `${``} <div class="content svelte-18djixa"><div class="title svelte-18djixa"><h1 data-svelte-h="svelte-gbnjg0">Space Name Definition</h1> ${$session ? `<button class="svelte-18djixa" data-svelte-h="svelte-f75plw">+ New Row</button>` : ``}</div> <div class="table_wrapper svelte-18djixa"><table class="${[
        "svelte-18djixa",
        ($theme == "light" ? "light" : "") + " " + ($theme == "dark" ? "dark" : "")
      ].join(" ").trim()}"><thead data-svelte-h="svelte-19z24qn"><tr><th class="svelte-18djixa"><div class="svelte-18djixa">Definition</div></th> <th class="svelte-18djixa"><div class="svelte-18djixa">SpaceName</div></th> <th class="svelte-18djixa"><div class="svelte-18djixa">Property</div></th> <th class="svelte-18djixa"><div class="svelte-18djixa">Description</div></th>  <th class="svelte-18djixa"></th></tr></thead> <tbody>${each(spaceNames, (item) => {
        return `<tr><td class="svelte-18djixa"><div class="svelte-18djixa">${escape(item.definition)}</div></td> <td class="svelte-18djixa"><div class="svelte-18djixa">${escape(item.spaceName)}</div></td> <td class="svelte-18djixa"><div class="svelte-18djixa">${escape(item.property)}</div></td> <td class="svelte-18djixa"><div class="svelte-18djixa">${escape(item.description)}</div></td>  <td class="svelte-18djixa">${$session ? `<div class="actions svelte-18djixa"><button class="none svelte-18djixa">${validate_component(Icon, "Icon").$$render($$result, { icon: "ic:baseline-edit" }, {}, {})}</button> <button class="none svelte-18djixa">${validate_component(Icon, "Icon").$$render($$result, { icon: "charm:copy" }, {}, {})}</button> <button class="none delete svelte-18djixa">${validate_component(Icon, "Icon").$$render($$result, { icon: "wpf:delete" }, {}, {})}</button> </div>` : ``}</td> </tr>`;
      })}</tbody></table></div> </div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/19.js
var __exports20 = {};
__export(__exports20, {
  component: () => component19,
  fonts: () => fonts20,
  imports: () => imports20,
  index: () => index20,
  server: () => page_server_exports5,
  server_id: () => server_id9,
  stylesheets: () => stylesheets20
});
var index20, component_cache19, component19, server_id9, imports20, stylesheets20, fonts20;
var init__20 = __esm({
  ".svelte-kit/output/server/nodes/19.js"() {
    init_page_server5();
    index20 = 19;
    component19 = async () => component_cache19 ?? (component_cache19 = (await Promise.resolve().then(() => (init_page_svelte13(), page_svelte_exports13))).default);
    server_id9 = "src/routes/(main)/spacename_old/+page.server.js";
    imports20 = ["_app/immutable/nodes/19.e3c1f55f.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js", "_app/immutable/chunks/each.a990872a.js", "_app/immutable/chunks/Icon.6fda2550.js", "_app/immutable/chunks/functions.93e96281.js", "_app/immutable/chunks/theme.store.0f9c2995.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/Modal.674a565a.js", "_app/immutable/chunks/supabase.store.eea9b4ba.js"];
    stylesheets20 = ["_app/immutable/assets/19.a8cbbe08.css", "_app/immutable/assets/WaterfallSingle.0c89d209.css"];
    fonts20 = [];
  }
});

// .svelte-kit/output/server/entries/endpoints/(admin)/admin/api/delete-user/_server.js
var server_exports = {};
__export(server_exports, {
  DELETE: () => DELETE
});
async function DELETE({ request, locals: { supabase: supabase2 } }) {
  const body = await request.json();
  const { data, error: error2 } = await supabase2.auth.admin.deleteUser(body.id);
  if (error2) {
    return json({ error: { code: error2.code, message: error2.message } });
  }
  return json(body);
}
var init_server = __esm({
  ".svelte-kit/output/server/entries/endpoints/(admin)/admin/api/delete-user/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(admin)/admin/api/disable-user/_server.js
var server_exports2 = {};
__export(server_exports2, {
  PUT: () => PUT
});
async function PUT({ request, locals: { supabase: supabase2 } }) {
  const body = await request.json();
  const { data, error: error2 } = await supabase2.auth.admin.updateUserById(
    body.user.id,
    { user_metadata: { disabled: body.disabled } }
  );
  if (error2) {
    return json({ error: { code: error2.code, message: error2.message } });
  }
  return json(data.user);
}
var init_server2 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(admin)/admin/api/disable-user/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(admin)/admin/api/invite-user-by-email/_server.js
var server_exports3 = {};
__export(server_exports3, {
  POST: () => POST
});
async function POST({ request, locals: { supabase: supabase2 } }) {
  const body = await request.json();
  const { data, error: error2 } = await supabase2.auth.admin.inviteUserByEmail(body.email);
  if (error2) {
    return json({ error: { code: error2.code, message: error2.message } });
  }
  const createdUser = data.user;
  const { data: user, error: updateError } = await supabase2.auth.admin.updateUserById(
    createdUser.id,
    { user_metadata: { referral: body.referral } }
  );
  if (updateError) {
    return json({ error: { code: updateError.code, message: updateError.message } });
  }
  return json(user.user);
}
var init_server3 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(admin)/admin/api/invite-user-by-email/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(admin)/admin/api/update-password/_server.js
var server_exports4 = {};
__export(server_exports4, {
  PUT: () => PUT2
});
async function PUT2({ request, locals: { supabase: supabase2 } }) {
  const body = await request.json();
  const { data, error: error2 } = await supabase2.auth.admin.updateUserById(
    body.id,
    { password: body.newPassword }
  );
  if (error2) {
    return json({ error: { code: error2.code, message: error2.message } });
  }
  return json(data.user);
}
var init_server4 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(admin)/admin/api/update-password/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(admin)/admin/api/update-role/_server.js
var server_exports5 = {};
__export(server_exports5, {
  PUT: () => PUT3
});
async function PUT3({ request, locals: { supabase: supabase2, getSession } }) {
  const body = await request.json();
  const session2 = await getSession();
  const allowedRoles = ["admin", "owner"];
  const role = session2.user.user_metadata.role;
  if (!allowedRoles.includes(role)) {
    return json({ error: { code: 403, message: "You do not have enough permission to update roles" } });
  }
  const { data: user, error: error2 } = await supabase2.auth.admin.updateUserById(
    body.user.id,
    { user_metadata: { role: body.newRole } }
  );
  if (error2) {
    return json({ error: { code: error2.code, message: error2.message } });
  }
  return json(user.user);
}
var init_server5 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(admin)/admin/api/update-role/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(admin)/admin/api/verify-email/_server.js
var server_exports6 = {};
__export(server_exports6, {
  PUT: () => PUT4
});
async function PUT4({ request, locals: { supabase: supabase2 } }) {
  const body = await request.json();
  const { data: user, error: error2 } = await supabase2.auth.admin.updateUserById(
    body.id,
    { email_confirm: true }
  );
  if (error2) {
    return json({ error: { code: error2.code, message: error2.message } });
  }
  return json(user.user);
}
var init_server6 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(admin)/admin/api/verify-email/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(main)/api/airtable/_server.js
var server_exports7 = {};
__export(server_exports7, {
  GET: () => GET
});
async function GET() {
  const comp = await getData("tblcETDGIaV9DXdfh");
  const pset = await getData("tblq6hccQMZOhp8Ww");
  return json({
    airtable: { comp, pset }
  });
}
async function getData(tableId) {
  const data = [];
  async function fetchPage(offset) {
    let query = "";
    if (offset) {
      query = `?offset=${offset}`;
    }
    const resp = await fetch(`${AIRTABLE_BASEID}/${tableId}${query}`, {
      headers: {
        "Authorization": `Bearer ${AIRTABLE_TOKEN}`
      }
    });
    const res = await resp.json();
    data.push(...res.records);
    const nextOffset = res.offset;
    if (nextOffset) {
      await fetchPage(nextOffset);
    }
  }
  await fetchPage();
  return data;
}
var init_server7 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(main)/api/airtable/_server.js"() {
    init_private();
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(main)/api/auth/user-is-ban/_server.js
var server_exports8 = {};
__export(server_exports8, {
  GET: () => GET2
});
async function GET2({ url, locals: { supabase: supabase2 } }) {
  const email = url.searchParams.get("email");
  if (!email) {
    return json({ error: { code: 400, message: "Email required" } });
  }
  return json({});
}
var init_server8 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(main)/api/auth/user-is-ban/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(main)/api/ifcsg/_server.js
var server_exports9 = {};
__export(server_exports9, {
  GET: () => GET3
});
async function GET3({ locals: { supabase: supabase2 } }) {
  const { data: ents, error: error2 } = await supabase2.from("entity").select();
  const { data: props, propError } = await supabase2.from("property").select();
  const { data: psets, psetError } = await supabase2.from("pset").select();
  for (const row of ents) {
    if (row.psets) {
      const psetData = {};
      for (const [pset_id, props_id] of Object.entries(row.psets)) {
        const psetName = psets.filter((x) => x.id == pset_id)[0].psetName;
        const thisProps = props.filter((x) => props_id.includes(x.id));
        psetData[psetName] = thisProps;
      }
      row.psets = psetData;
    }
  }
  ents.sort((a, b) => {
    a.test = a.key.replace("null", "");
    b.test = b.key.replace("null", "");
    if (a.test < b.test) {
      return -1;
    } else if (a.test > b.test) {
      return 1;
    }
    return 0;
  });
  return json(ents);
}
var init_server9 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(main)/api/ifcsg/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(main)/api/ifcsg/get-properties/_server.js
var server_exports10 = {};
__export(server_exports10, {
  GET: () => GET4
});
async function GET4({ request, locals: { supabase: supabase2 } }) {
  const { data, error: error2 } = await supabase2.from("property").select();
  console.log(data);
  return json(data);
}
var init_server10 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(main)/api/ifcsg/get-properties/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(main)/api/ifcsg/update-description/_server.js
var server_exports11 = {};
__export(server_exports11, {
  PUT: () => PUT5
});
async function PUT5({ request, locals: { supabase: supabase2 } }) {
  const body = await request.json();
  delete body.DataType;
  const { data, error: error2 } = await supabase2.from("property").upsert(body).select();
  if (error2) {
    return json({ error: { code: error2.code, message: error2.message } });
  }
  return json(data[0]);
}
var init_server11 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(main)/api/ifcsg/update-description/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(main)/area-gfa/_server.js
var server_exports12 = {};
__export(server_exports12, {
  GET: () => GET5
});
async function GET5() {
  const resp = await fetch("https://gfasync-mljlk3jxzq-as.a.run.app");
  const result = await resp.json();
  return json(result);
}
var init_server12 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(main)/area-gfa/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/endpoints/(main)/modellingguide/_slug_/_server.js
var server_exports13 = {};
__export(server_exports13, {
  GET: () => GET6
});
async function GET6({ fetch: fetch2, url, locals: { supabase: supabase2 } }) {
  const q = url.searchParams.get("url");
  const resp = await fetch2(q);
  const data = await resp.json();
  if (data.error) {
    return json(false);
  }
  return json(data);
}
var init_server13 = __esm({
  ".svelte-kit/output/server/entries/endpoints/(main)/modellingguide/_slug_/_server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/chunks/internal.js
init_ssr();
var base = "";
var assets = base;
var initial = { base, assets };
function reset() {
  base = initial.base;
  assets = initial.assets;
}
var public_env = {};
function set_private_env(environment) {
}
function set_public_env(environment) {
  public_env = environment;
}
function afterUpdate() {
}
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { constructors } = $$props;
  let { components = [] } = $$props;
  let { form } = $$props;
  let { data_0 = null } = $$props;
  let { data_1 = null } = $$props;
  let { data_2 = null } = $$props;
  let { data_3 = null } = $$props;
  {
    setContext("__svelte__", stores);
  }
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.constructors === void 0 && $$bindings.constructors && constructors !== void 0)
    $$bindings.constructors(constructors);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.data_0 === void 0 && $$bindings.data_0 && data_0 !== void 0)
    $$bindings.data_0(data_0);
  if ($$props.data_1 === void 0 && $$bindings.data_1 && data_1 !== void 0)
    $$bindings.data_1(data_1);
  if ($$props.data_2 === void 0 && $$bindings.data_2 && data_2 !== void 0)
    $$bindings.data_2(data_2);
  if ($$props.data_3 === void 0 && $$bindings.data_3 && data_3 !== void 0)
    $$bindings.data_3(data_3);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      stores.page.set(page2);
    }
    $$rendered = `  ${constructors[1] ? `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${constructors[2] ? `${validate_component(constructors[1] || missing_component, "svelte:component").$$render(
            $$result,
            { data: data_1, this: components[1] },
            {
              this: ($$value) => {
                components[1] = $$value;
                $$settled = false;
              }
            },
            {
              default: () => {
                return `${constructors[3] ? `${validate_component(constructors[2] || missing_component, "svelte:component").$$render(
                  $$result,
                  { data: data_2, this: components[2] },
                  {
                    this: ($$value) => {
                      components[2] = $$value;
                      $$settled = false;
                    }
                  },
                  {
                    default: () => {
                      return `${validate_component(constructors[3] || missing_component, "svelte:component").$$render(
                        $$result,
                        { data: data_3, form, this: components[3] },
                        {
                          this: ($$value) => {
                            components[3] = $$value;
                            $$settled = false;
                          }
                        },
                        {}
                      )}`;
                    }
                  }
                )}` : `${validate_component(constructors[2] || missing_component, "svelte:component").$$render(
                  $$result,
                  { data: data_2, form, this: components[2] },
                  {
                    this: ($$value) => {
                      components[2] = $$value;
                      $$settled = false;
                    }
                  },
                  {}
                )}`}`;
              }
            }
          )}` : `${validate_component(constructors[1] || missing_component, "svelte:component").$$render(
            $$result,
            { data: data_1, form, this: components[1] },
            {
              this: ($$value) => {
                components[1] = $$value;
                $$settled = false;
              }
            },
            {}
          )}`}`;
        }
      }
    )}` : `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, form, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {}
    )}`} ${``}`;
  } while (!$$settled);
  return $$rendered;
});
var options = {
  app_template_contains_nonce: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: true,
  track_server_fetches: false,
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root: Root,
  service_worker: false,
  templates: {
    app: ({ head, body, assets: assets2, nonce, env }) => '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n	<meta charset="utf-8" />\n	<link rel="icon" href="' + assets2 + '/favicon.png" />\n	<meta name="viewport" content="width=device-width" />\n	<title>cx-mc: IFC-SG [DEV]</title>\n	' + head + '\n</head>\n\n<body data-sveltekit-preload-data="hover">\n	<div style="display: contents">' + body + "</div>\n</body>\n\n</html>",
    error: ({ status, message }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
					Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "w9l9cm"
};
function get_hooks() {
  return Promise.resolve().then(() => (init_hooks_server(), hooks_server_exports));
}

// .svelte-kit/output/server/index.js
init_chunks();

// node_modules/devalue/src/utils.js
var escaped = {
  "<": "\\u003C",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var DevalueError = class extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(message, keys) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
  }
};
function is_primitive(thing) {
  return Object(thing) !== thing;
}
var object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
  Object.prototype
).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}

// node_modules/devalue/src/uneval.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafe_chars = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
function uneval(value, replacer) {
  const counts = /* @__PURE__ */ new Map();
  const keys = [];
  const custom = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (!is_primitive(thing)) {
      if (counts.has(thing)) {
        counts.set(thing, counts.get(thing) + 1);
        return;
      }
      counts.set(thing, 1);
      if (replacer) {
        const str2 = replacer(thing);
        if (typeof str2 === "string") {
          custom.set(thing, str2);
          return;
        }
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "BigInt":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach((value2, i) => {
            keys.push(`[${i}]`);
            walk(value2);
            keys.pop();
          });
          break;
        case "Set":
          Array.from(thing).forEach(walk);
          break;
        case "Map":
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive(key2) : "..."})`
            );
            walk(value2);
            keys.pop();
          }
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          for (const key2 in thing) {
            keys.push(`.${key2}`);
            walk(thing[key2]);
            keys.pop();
          }
      }
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
    names.set(entry[0], get_name(i));
  });
  function stringify2(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (is_primitive(thing)) {
      return stringify_primitive(thing);
    }
    if (custom.has(thing)) {
      return custom.get(thing);
    }
    const type = get_type(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify2(thing.valueOf())})`;
      case "RegExp":
        return `new RegExp(${stringify_string(thing.source)}, "${thing.flags}")`;
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "Array":
        const members = (
          /** @type {any[]} */
          thing.map(
            (v, i) => i in thing ? stringify2(v) : ""
          )
        );
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return `[${members.join(",")}${tail}]`;
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify2).join(",")}])`;
      default:
        const obj = `{${Object.keys(thing).map((key2) => `${safe_key(key2)}:${stringify2(thing[key2])}`).join(",")}}`;
        const proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? `Object.assign(Object.create(null),${obj})` : `Object.create(null)`;
        }
        return obj;
    }
  }
  const str = stringify2(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (custom.has(thing)) {
        values.push(
          /** @type {string} */
          custom.get(thing)
        );
        return;
      }
      if (is_primitive(thing)) {
        values.push(stringify_primitive(thing));
        return;
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify2(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i) => {
            statements.push(`${name}[${i}]=${stringify2(v)}`);
          });
          break;
        case "Set":
          values.push(`new Set`);
          statements.push(
            `${name}.${Array.from(thing).map((v) => `add(${stringify2(v)})`).join(".")}`
          );
          break;
        case "Map":
          values.push(`new Map`);
          statements.push(
            `${name}.${Array.from(thing).map(([k, v]) => `set(${stringify2(k)}, ${stringify2(v)})`).join(".")}`
          );
          break;
        default:
          values.push(
            Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}"
          );
          Object.keys(thing).forEach((key2) => {
            statements.push(
              `${name}${safe_prop(key2)}=${stringify2(thing[key2])}`
            );
          });
      }
    });
    statements.push(`return ${str}`);
    return `(function(${params.join(",")}){${statements.join(
      ";"
    )}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
function get_name(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
function escape_unsafe_char(c) {
  return escaped[c] || c;
}
function escape_unsafe_chars(str) {
  return str.replace(unsafe_chars, escape_unsafe_char);
}
function safe_key(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escape_unsafe_chars(JSON.stringify(key2));
}
function safe_prop(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? `.${key2}` : `[${escape_unsafe_chars(JSON.stringify(key2))}]`;
}
function stringify_primitive(thing) {
  if (typeof thing === "string")
    return stringify_string(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  const str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  if (typeof thing === "bigint")
    return thing + "n";
  return str;
}

// node_modules/devalue/src/constants.js
var UNDEFINED = -1;
var HOLE = -2;
var NAN = -3;
var POSITIVE_INFINITY = -4;
var NEGATIVE_INFINITY = -5;
var NEGATIVE_ZERO = -6;

// node_modules/devalue/src/stringify.js
function stringify(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  for (const key2 in reducers) {
    custom.push({ key: key2, fn: reducers[key2] });
  }
  const keys = [];
  let p = 0;
  function flatten(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (indexes.has(thing))
      return indexes.get(thing);
    if (thing === void 0)
      return UNDEFINED;
    if (Number.isNaN(thing))
      return NAN;
    if (thing === Infinity)
      return POSITIVE_INFINITY;
    if (thing === -Infinity)
      return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0)
      return NEGATIVE_ZERO;
    const index22 = p++;
    indexes.set(thing, index22);
    for (const { key: key2, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index22] = `["${key2}",${flatten(value2)}]`;
        return index22;
      }
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive2(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          str = `["Object",${stringify_primitive2(thing)}]`;
          break;
        case "BigInt":
          str = `["BigInt",${thing}]`;
          break;
        case "Date":
          str = `["Date","${thing.toISOString()}"]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array":
          str = "[";
          for (let i = 0; i < thing.length; i += 1) {
            if (i > 0)
              str += ",";
            if (i in thing) {
              keys.push(`[${i}]`);
              str += flatten(thing[i]);
              keys.pop();
            } else {
              str += HOLE;
            }
          }
          str += "]";
          break;
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive2(key2) : "..."})`
            );
            str += `,${flatten(key2)},${flatten(value2)}`;
          }
          str += "]";
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key2 in thing) {
              keys.push(`.${key2}`);
              str += `,${stringify_string(key2)},${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key2 in thing) {
              if (started)
                str += ",";
              started = true;
              keys.push(`.${key2}`);
              str += `${stringify_string(key2)}:${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index22] = str;
    return index22;
  }
  const index21 = flatten(value);
  if (index21 < 0)
    return `${index21}`;
  return `[${stringified.join(",")}]`;
}
function stringify_primitive2(thing) {
  const type = typeof thing;
  if (type === "string")
    return stringify_string(thing);
  if (thing instanceof String)
    return stringify_string(thing.toString());
  if (thing === void 0)
    return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0)
    return NEGATIVE_ZERO.toString();
  if (type === "bigint")
    return `["BigInt","${thing}"]`;
  return String(thing);
}

// .svelte-kit/output/server/index.js
init_index2();
var import_cookie3 = __toESM(require_cookie2(), 1);
var set_cookie_parser = __toESM(require_set_cookie(), 1);
var DEV = false;
var SVELTE_KIT_ASSETS = "/_svelte_kit_assets";
var ENDPOINT_METHODS = /* @__PURE__ */ new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD"
]);
var PAGE_METHODS = /* @__PURE__ */ new Set(["GET", "POST", "HEAD"]);
function negotiate(accept, types2) {
  const parts = [];
  accept.split(",").forEach((str, i) => {
    const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      parts.push({ type, subtype, q: +q, i });
    }
  });
  parts.sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types2) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex(
      (part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*")
    );
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function is_content_type(request, ...types2) {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
  return types2.includes(type.toLowerCase());
}
function is_form_content_type(request) {
  return is_content_type(
    request,
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain"
  );
}
function exec(match, params, matchers) {
  const result = {};
  const values = match.slice(1);
  let buffered = 0;
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    let value = values[i - buffered];
    if (param.chained && param.rest && buffered) {
      value = values.slice(i - buffered, i + 1).filter((s2) => s2).join("/");
      buffered = 0;
    }
    if (value === void 0) {
      if (param.rest)
        result[param.name] = "";
      continue;
    }
    if (!param.matcher || matchers[param.matcher](value)) {
      result[param.name] = value;
      const next_param = params[i + 1];
      const next_value = values[i + 1];
      if (next_param && !next_param.rest && next_param.optional && next_value && param.chained) {
        buffered = 0;
      }
      continue;
    }
    if (param.optional && param.chained) {
      buffered++;
      continue;
    }
    return;
  }
  if (buffered)
    return;
  return result;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && /** @type {any} */
  err.name && /** @type {any} */
  err.message ? (
    /** @type {Error} */
    err
  ) : new Error(JSON.stringify(err));
}
function normalize_error(error2) {
  return (
    /** @type {import('../runtime/control.js').Redirect | import('../runtime/control.js').HttpError | Error} */
    error2
  );
}
function method_not_allowed(mod, method) {
  return text(`${method} method not allowed`, {
    status: 405,
    headers: {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: allowed_methods(mod).join(", ")
    }
  });
}
function allowed_methods(mod) {
  const allowed = Array.from(ENDPOINT_METHODS).filter((method) => method in mod);
  if ("GET" in mod || "HEAD" in mod)
    allowed.push("HEAD");
  return allowed;
}
function static_error_page(options2, status, message) {
  let page2 = options2.templates.error({ status, message });
  return text(page2, {
    headers: { "content-type": "text/html; charset=utf-8" },
    status
  });
}
async function handle_fatal_error(event, options2, error2) {
  error2 = error2 instanceof HttpError ? error2 : coalesce_to_error(error2);
  const status = error2 instanceof HttpError ? error2.status : 500;
  const body = await handle_error_and_jsonify(event, options2, error2);
  const type = negotiate(event.request.headers.get("accept") || "text/html", [
    "application/json",
    "text/html"
  ]);
  if (event.isDataRequest || type === "application/json") {
    return json(body, {
      status
    });
  }
  return static_error_page(options2, status, body.message);
}
async function handle_error_and_jsonify(event, options2, error2) {
  if (error2 instanceof HttpError) {
    return error2.body;
  } else {
    return await options2.hooks.handleError({ error: error2, event }) ?? {
      message: event.route.id != null ? "Internal Error" : "Not Found"
    };
  }
}
function redirect_response(status, location) {
  const response = new Response(void 0, {
    status,
    headers: { location }
  });
  return response;
}
function clarify_devalue_error(event, error2) {
  if (error2.path) {
    return `Data returned from \`load\` while rendering ${event.route.id} is not serializable: ${error2.message} (data${error2.path})`;
  }
  if (error2.path === "") {
    return `Data returned from \`load\` while rendering ${event.route.id} is not a plain object`;
  }
  return error2.message;
}
function stringify_uses(node) {
  const uses = [];
  if (node.uses && node.uses.dependencies.size > 0) {
    uses.push(`"dependencies":${JSON.stringify(Array.from(node.uses.dependencies))}`);
  }
  if (node.uses && node.uses.params.size > 0) {
    uses.push(`"params":${JSON.stringify(Array.from(node.uses.params))}`);
  }
  if (node.uses?.parent)
    uses.push('"parent":1');
  if (node.uses?.route)
    uses.push('"route":1');
  if (node.uses?.url)
    uses.push('"url":1');
  return `"uses":{${uses.join(",")}}`;
}
async function render_endpoint(event, mod, state) {
  const method = (
    /** @type {import('types').HttpMethod} */
    event.request.method
  );
  let handler2 = mod[method] || mod.fallback;
  if (method === "HEAD" && mod.GET && !mod.HEAD) {
    handler2 = mod.GET;
  }
  if (!handler2) {
    return method_not_allowed(mod, method);
  }
  const prerender = mod.prerender ?? state.prerender_default;
  if (prerender && (mod.POST || mod.PATCH || mod.PUT || mod.DELETE)) {
    throw new Error("Cannot prerender endpoints that have mutative methods");
  }
  if (state.prerendering && !prerender) {
    if (state.depth > 0) {
      throw new Error(`${event.route.id} is not prerenderable`);
    } else {
      return new Response(void 0, { status: 204 });
    }
  }
  try {
    let response = await handler2(
      /** @type {import('@sveltejs/kit').RequestEvent<Record<string, any>>} */
      event
    );
    if (!(response instanceof Response)) {
      throw new Error(
        `Invalid response from route ${event.url.pathname}: handler should return a Response object`
      );
    }
    if (state.prerendering) {
      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
      });
      response.headers.set("x-sveltekit-prerender", String(prerender));
    }
    return response;
  } catch (e) {
    if (e instanceof Redirect) {
      return new Response(void 0, {
        status: e.status,
        headers: { location: e.location }
      });
    }
    throw e;
  }
}
function is_endpoint_request(event) {
  const { method, headers } = event.request;
  if (ENDPOINT_METHODS.has(method) && !PAGE_METHODS.has(method)) {
    return true;
  }
  if (method === "POST" && headers.get("x-sveltekit-action") === "true")
    return false;
  const accept = event.request.headers.get("accept") ?? "*/*";
  return negotiate(accept, ["*", "text/html"]) !== "text/html";
}
function compact(arr) {
  return arr.filter(
    /** @returns {val is NonNullable<T>} */
    (val) => val != null
  );
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
function decode_pathname(pathname) {
  return pathname.split("%25").map(decodeURI).join("%25");
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = decodeURIComponent(params[key2]);
  }
  return params;
}
var tracked_url_properties = (
  /** @type {const} */
  [
    "href",
    "pathname",
    "search",
    "searchParams",
    "toString",
    "toJSON"
  ]
);
function make_trackable(url, callback) {
  const tracked = new URL(url);
  for (const property of tracked_url_properties) {
    Object.defineProperty(tracked, property, {
      get() {
        callback();
        return url[property];
      },
      enumerable: true,
      configurable: true
    });
  }
  {
    tracked[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url, opts);
    };
  }
  disable_hash(tracked);
  return tracked;
}
function disable_hash(url) {
  allow_nodejs_console_log(url);
  Object.defineProperty(url, "hash", {
    get() {
      throw new Error(
        "Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead"
      );
    }
  });
}
function disable_search(url) {
  allow_nodejs_console_log(url);
  for (const property of ["search", "searchParams"]) {
    Object.defineProperty(url, property, {
      get() {
        throw new Error(`Cannot access url.${property} on a page with prerendering enabled`);
      }
    });
  }
}
function allow_nodejs_console_log(url) {
  {
    url[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(new URL(url), opts);
    };
  }
}
var DATA_SUFFIX = "/__data.json";
function has_data_suffix(pathname) {
  return pathname.endsWith(DATA_SUFFIX);
}
function add_data_suffix(pathname) {
  return pathname.replace(/\/$/, "") + DATA_SUFFIX;
}
function strip_data_suffix(pathname) {
  return pathname.slice(0, -DATA_SUFFIX.length);
}
function is_action_json_request(event) {
  const accept = negotiate(event.request.headers.get("accept") ?? "*/*", [
    "application/json",
    "text/html"
  ]);
  return accept === "application/json" && event.request.method === "POST";
}
async function handle_action_json_request(event, options2, server2) {
  const actions = server2?.actions;
  if (!actions) {
    const no_actions_error = error(405, "POST method not allowed. No actions exist for this page");
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, options2, no_actions_error)
      },
      {
        status: no_actions_error.status,
        headers: {
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
          // "The server must generate an Allow header field in a 405 status code response"
          allow: "GET"
        }
      }
    );
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, actions);
    if (false)
      ;
    if (data instanceof ActionFailure) {
      return action_json({
        type: "failure",
        status: data.status,
        // @ts-expect-error we assign a string to what is supposed to be an object. That's ok
        // because we don't use the object outside, and this way we have better code navigation
        // through knowing where the related interface is used.
        data: stringify_action_response(
          data.data,
          /** @type {string} */
          event.route.id
        )
      });
    } else {
      return action_json({
        type: "success",
        status: data ? 200 : 204,
        // @ts-expect-error see comment above
        data: stringify_action_response(
          data,
          /** @type {string} */
          event.route.id
        )
      });
    }
  } catch (e) {
    const err = normalize_error(e);
    if (err instanceof Redirect) {
      return action_json_redirect(err);
    }
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, options2, check_incorrect_fail_use(err))
      },
      {
        status: err instanceof HttpError ? err.status : 500
      }
    );
  }
}
function check_incorrect_fail_use(error2) {
  return error2 instanceof ActionFailure ? new Error('Cannot "throw fail()". Use "return fail()"') : error2;
}
function action_json_redirect(redirect2) {
  return action_json({
    type: "redirect",
    status: redirect2.status,
    location: redirect2.location
  });
}
function action_json(data, init2) {
  return json(data, init2);
}
function is_action_request(event) {
  return event.request.method === "POST";
}
async function handle_action_request(event, server2) {
  const actions = server2?.actions;
  if (!actions) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: error(405, "POST method not allowed. No actions exist for this page")
    };
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, actions);
    if (false)
      ;
    if (data instanceof ActionFailure) {
      return {
        type: "failure",
        status: data.status,
        data: data.data
      };
    } else {
      return {
        type: "success",
        status: 200,
        // @ts-expect-error this will be removed upon serialization, so `undefined` is the same as omission
        data
      };
    }
  } catch (e) {
    const err = normalize_error(e);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
function check_named_default_separate(actions) {
  if (actions.default && Object.keys(actions).length > 1) {
    throw new Error(
      "When using named actions, the default action cannot be used. See the docs for more info: https://kit.svelte.dev/docs/form-actions#named-actions"
    );
  }
}
async function call_action(event, actions) {
  const url = new URL(event.request.url);
  let name = "default";
  for (const param of url.searchParams) {
    if (param[0].startsWith("/")) {
      name = param[0].slice(1);
      if (name === "default") {
        throw new Error('Cannot use reserved action name "default"');
      }
      break;
    }
  }
  const action = actions[name];
  if (!action) {
    throw new Error(`No action with name '${name}' found`);
  }
  if (!is_form_content_type(event.request)) {
    throw new Error(
      `Actions expect form-encoded data (received ${event.request.headers.get("content-type")})`
    );
  }
  return action(event);
}
function uneval_action_response(data, route_id) {
  return try_deserialize(data, uneval, route_id);
}
function stringify_action_response(data, route_id) {
  return try_deserialize(data, stringify, route_id);
}
function try_deserialize(data, fn, route_id) {
  try {
    return fn(data);
  } catch (e) {
    const error2 = (
      /** @type {any} */
      e
    );
    if ("path" in error2) {
      let message = `Data returned from action inside ${route_id} is not serializable: ${error2.message}`;
      if (error2.path !== "")
        message += ` (data.${error2.path})`;
      throw new Error(message);
    }
    throw error2;
  }
}
async function unwrap_promises(object) {
  for (const key2 in object) {
    if (typeof object[key2]?.then === "function") {
      return Object.fromEntries(
        await Promise.all(Object.entries(object).map(async ([key3, value]) => [key3, await value]))
      );
    }
  }
  return object;
}
var INVALIDATED_PARAM = "x-sveltekit-invalidated";
var TRAILING_SLASH_PARAM = "x-sveltekit-trailing-slash";
async function load_server_data({
  event,
  state,
  node,
  parent,
  // TODO 2.0: Remove this
  track_server_fetches
}) {
  if (!node?.server)
    return null;
  const uses = {
    dependencies: /* @__PURE__ */ new Set(),
    params: /* @__PURE__ */ new Set(),
    parent: false,
    route: false,
    url: false
  };
  const url = make_trackable(event.url, () => {
    uses.url = true;
  });
  if (state.prerendering) {
    disable_search(url);
  }
  const result = await node.server.load?.call(null, {
    ...event,
    fetch: (info, init2) => {
      const url2 = new URL(info instanceof Request ? info.url : info, event.url);
      if (track_server_fetches) {
        uses.dependencies.add(url2.href);
      }
      return event.fetch(info, init2);
    },
    /** @param {string[]} deps */
    depends: (...deps) => {
      for (const dep of deps) {
        const { href } = new URL(dep, event.url);
        uses.dependencies.add(href);
      }
    },
    params: new Proxy(event.params, {
      get: (target, key2) => {
        uses.params.add(key2);
        return target[
          /** @type {string} */
          key2
        ];
      }
    }),
    parent: async () => {
      uses.parent = true;
      return parent();
    },
    route: new Proxy(event.route, {
      get: (target, key2) => {
        uses.route = true;
        return target[
          /** @type {'id'} */
          key2
        ];
      }
    }),
    url
  });
  const data = result ? await unwrap_promises(result) : null;
  return {
    type: "data",
    data,
    uses,
    slash: node.server.trailingSlash
  };
}
async function load_data({
  event,
  fetched,
  node,
  parent,
  server_data_promise,
  state,
  resolve_opts,
  csr
}) {
  const server_data_node = await server_data_promise;
  if (!node?.universal?.load) {
    return server_data_node?.data ?? null;
  }
  const result = await node.universal.load.call(null, {
    url: event.url,
    params: event.params,
    data: server_data_node?.data ?? null,
    route: event.route,
    fetch: create_universal_fetch(event, state, fetched, csr, resolve_opts),
    setHeaders: event.setHeaders,
    depends: () => {
    },
    parent
  });
  const data = result ? await unwrap_promises(result) : null;
  return data;
}
function create_universal_fetch(event, state, fetched, csr, resolve_opts) {
  return async (input, init2) => {
    const cloned_body = input instanceof Request && input.body ? input.clone().body : null;
    const cloned_headers = input instanceof Request && [...input.headers].length ? new Headers(input.headers) : init2?.headers;
    let response = await event.fetch(input, init2);
    const url = new URL(input instanceof Request ? input.url : input, event.url);
    const same_origin = url.origin === event.url.origin;
    let dependency;
    if (same_origin) {
      if (state.prerendering) {
        dependency = { response, body: null };
        state.prerendering.dependencies.set(url.pathname, dependency);
      }
    } else {
      const mode = input instanceof Request ? input.mode : init2?.mode ?? "cors";
      if (mode === "no-cors") {
        response = new Response("", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } else {
        const acao = response.headers.get("access-control-allow-origin");
        if (!acao || acao !== event.url.origin && acao !== "*") {
          throw new Error(
            `CORS error: ${acao ? "Incorrect" : "No"} 'Access-Control-Allow-Origin' header is present on the requested resource`
          );
        }
      }
    }
    const proxy = new Proxy(response, {
      get(response2, key2, _receiver) {
        async function text2() {
          const body = await response2.text();
          if (!body || typeof body === "string") {
            const status_number = Number(response2.status);
            if (isNaN(status_number)) {
              throw new Error(
                `response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`
              );
            }
            fetched.push({
              url: same_origin ? url.href.slice(event.url.origin.length) : url.href,
              method: event.request.method,
              request_body: (
                /** @type {string | ArrayBufferView | undefined} */
                input instanceof Request && cloned_body ? await stream_to_string(cloned_body) : init2?.body
              ),
              request_headers: cloned_headers,
              response_body: body,
              response: response2
            });
          }
          if (dependency) {
            dependency.body = body;
          }
          return body;
        }
        if (key2 === "arrayBuffer") {
          return async () => {
            const buffer = await response2.arrayBuffer();
            if (dependency) {
              dependency.body = new Uint8Array(buffer);
            }
            return buffer;
          };
        }
        if (key2 === "text") {
          return text2;
        }
        if (key2 === "json") {
          return async () => {
            return JSON.parse(await text2());
          };
        }
        return Reflect.get(response2, key2, response2);
      }
    });
    if (csr) {
      const get2 = response.headers.get;
      response.headers.get = (key2) => {
        const lower = key2.toLowerCase();
        const value = get2.call(response.headers, lower);
        if (value && !lower.startsWith("x-sveltekit-")) {
          const included = resolve_opts.filterSerializedResponseHeaders(lower, value);
          if (!included) {
            throw new Error(
              `Failed to get response header "${lower}" \u2014 it must be included by the \`filterSerializedResponseHeaders\` option: https://kit.svelte.dev/docs/hooks#server-hooks-handle (at ${event.route.id})`
            );
          }
        }
        return value;
      };
    }
    return proxy;
  };
}
async function stream_to_string(stream) {
  let result = "";
  const reader = stream.getReader();
  const decoder2 = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += decoder2.decode(value);
  }
  return result;
}
function hash(...values) {
  let hash2 = 5381;
  for (const value of values) {
    if (typeof value === "string") {
      let i = value.length;
      while (i)
        hash2 = hash2 * 33 ^ value.charCodeAt(--i);
    } else if (ArrayBuffer.isView(value)) {
      const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      let i = buffer.length;
      while (i)
        hash2 = hash2 * 33 ^ buffer[--i];
    } else {
      throw new TypeError("value must be a string or TypedArray");
    }
  }
  return (hash2 >>> 0).toString(36);
}
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
};
var escape_html_attr_regex = new RegExp(
  // special characters
  `[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`,
  "g"
);
function escape_html_attr(str) {
  const escaped_str = str.replace(escape_html_attr_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return `"${escaped_str}"`;
}
var replacements = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var pattern = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");
function serialize_data(fetched, filter, prerendering = false) {
  const headers = {};
  let cache_control = null;
  let age = null;
  let varyAny = false;
  for (const [key2, value] of fetched.response.headers) {
    if (filter(key2, value)) {
      headers[key2] = value;
    }
    if (key2 === "cache-control")
      cache_control = value;
    else if (key2 === "age")
      age = value;
    else if (key2 === "vary" && value.trim() === "*")
      varyAny = true;
  }
  const payload = {
    status: fetched.response.status,
    statusText: fetched.response.statusText,
    headers,
    body: fetched.response_body
  };
  const safe_payload = JSON.stringify(payload).replace(pattern, (match) => replacements[match]);
  const attrs = [
    'type="application/json"',
    "data-sveltekit-fetched",
    `data-url=${escape_html_attr(fetched.url)}`
  ];
  if (fetched.request_headers || fetched.request_body) {
    const values = [];
    if (fetched.request_headers) {
      values.push([...new Headers(fetched.request_headers)].join(","));
    }
    if (fetched.request_body) {
      values.push(fetched.request_body);
    }
    attrs.push(`data-hash="${hash(...values)}"`);
  }
  if (!prerendering && fetched.method === "GET" && cache_control && !varyAny) {
    const match = /s-maxage=(\d+)/g.exec(cache_control) ?? /max-age=(\d+)/g.exec(cache_control);
    if (match) {
      const ttl = +match[1] - +(age ?? "0");
      attrs.push(`data-ttl="${ttl}"`);
    }
  }
  return `<script ${attrs.join(" ")}>${safe_payload}<\/script>`;
}
var s = JSON.stringify;
var encoder$2 = new TextEncoder();
function sha2562(data) {
  if (!key[0])
    precompute();
  const out = init.slice(0);
  const array2 = encode3(data);
  for (let i = 0; i < array2.length; i += 16) {
    const w = array2.subarray(i, i + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i2 = 0; i2 < 64; i2++) {
      if (i2 < 16) {
        tmp = w[i2];
      } else {
        a = w[i2 + 1 & 15];
        b = w[i2 + 14 & 15];
        tmp = w[i2 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i2 & 15] + w[i2 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i2];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x) {
    return (x - Math.floor(x)) * 4294967296;
  }
  let prime = 2;
  for (let i = 0; i < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i < 8) {
        init[i] = frac(prime ** (1 / 2));
      }
      key[i] = frac(prime ** (1 / 3));
      i++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i = 0; i < bytes.length; i += 4) {
    const a = bytes[i + 0];
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    const d = bytes[i + 3];
    bytes[i + 0] = d;
    bytes[i + 1] = c;
    bytes[i + 2] = b;
    bytes[i + 3] = a;
  }
}
function encode3(str) {
  const encoded = encoder$2.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var chars2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i;
  for (i = 2; i < l; i += 3) {
    result += chars2[bytes[i - 2] >> 2];
    result += chars2[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += chars2[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
    result += chars2[bytes[i] & 63];
  }
  if (i === l + 1) {
    result += chars2[bytes[i - 2] >> 2];
    result += chars2[(bytes[i - 2] & 3) << 4];
    result += "==";
  }
  if (i === l) {
    result += chars2[bytes[i - 2] >> 2];
    result += chars2[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += chars2[(bytes[i - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
var array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return base64(array);
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample",
  "wasm-unsafe-eval",
  "script"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var _use_hashes, _script_needs_csp, _style_needs_csp, _directives, _script_src, _style_src, _nonce;
var BaseProvider = class {
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    /** @type {boolean} */
    __privateAdd(this, _use_hashes, void 0);
    /** @type {boolean} */
    __privateAdd(this, _script_needs_csp, void 0);
    /** @type {boolean} */
    __privateAdd(this, _style_needs_csp, void 0);
    /** @type {import('types').CspDirectives} */
    __privateAdd(this, _directives, void 0);
    /** @type {import('types').Csp.Source[]} */
    __privateAdd(this, _script_src, void 0);
    /** @type {import('types').Csp.Source[]} */
    __privateAdd(this, _style_src, void 0);
    /** @type {string} */
    __privateAdd(this, _nonce, void 0);
    __privateSet(this, _use_hashes, use_hashes);
    __privateSet(this, _directives, directives);
    const d = __privateGet(this, _directives);
    __privateSet(this, _script_src, []);
    __privateSet(this, _style_src, []);
    const effective_script_src = d["script-src"] || d["default-src"];
    const effective_style_src = d["style-src"] || d["default-src"];
    __privateSet(this, _script_needs_csp, !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0);
    __privateSet(this, _style_needs_csp, !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0);
    this.script_needs_nonce = __privateGet(this, _script_needs_csp) && !__privateGet(this, _use_hashes);
    this.style_needs_nonce = __privateGet(this, _style_needs_csp) && !__privateGet(this, _use_hashes);
    __privateSet(this, _nonce, nonce);
  }
  /** @param {string} content */
  add_script(content) {
    if (__privateGet(this, _script_needs_csp)) {
      if (__privateGet(this, _use_hashes)) {
        __privateGet(this, _script_src).push(`sha256-${sha2562(content)}`);
      } else if (__privateGet(this, _script_src).length === 0) {
        __privateGet(this, _script_src).push(`nonce-${__privateGet(this, _nonce)}`);
      }
    }
  }
  /** @param {string} content */
  add_style(content) {
    if (__privateGet(this, _style_needs_csp)) {
      if (__privateGet(this, _use_hashes)) {
        __privateGet(this, _style_src).push(`sha256-${sha2562(content)}`);
      } else if (__privateGet(this, _style_src).length === 0) {
        __privateGet(this, _style_src).push(`nonce-${__privateGet(this, _nonce)}`);
      }
    }
  }
  /**
   * @param {boolean} [is_meta]
   */
  get_header(is_meta = false) {
    const header = [];
    const directives = { ...__privateGet(this, _directives) };
    if (__privateGet(this, _style_src).length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...__privateGet(this, _style_src)
      ];
    }
    if (__privateGet(this, _script_src).length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...__privateGet(this, _script_src)
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = (
        /** @type {string[] | true} */
        directives[key2]
      );
      if (!value)
        continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
};
_use_hashes = new WeakMap();
_script_needs_csp = new WeakMap();
_style_needs_csp = new WeakMap();
_directives = new WeakMap();
_script_src = new WeakMap();
_style_src = new WeakMap();
_nonce = new WeakMap();
var CspProvider = class extends BaseProvider {
  get_meta() {
    const content = this.get_header(true);
    if (!content) {
      return;
    }
    return `<meta http-equiv="content-security-policy" content=${escape_html_attr(content)}>`;
  }
};
var CspReportOnlyProvider = class extends BaseProvider {
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    super(use_hashes, directives, nonce);
    if (Object.values(directives).filter((v) => !!v).length > 0) {
      const has_report_to = directives["report-to"]?.length ?? 0 > 0;
      const has_report_uri = directives["report-uri"]?.length ?? 0 > 0;
      if (!has_report_to && !has_report_uri) {
        throw Error(
          "`content-security-policy-report-only` must be specified with either the `report-to` or `report-uri` directives, or both"
        );
      }
    }
  }
};
var Csp = class {
  /**
   * @param {import('./types').CspConfig} config
   * @param {import('./types').CspOpts} opts
   */
  constructor({ mode, directives, reportOnly }, { prerender }) {
    /** @readonly */
    __publicField(this, "nonce", generate_nonce());
    /** @type {CspProvider} */
    __publicField(this, "csp_provider");
    /** @type {CspReportOnlyProvider} */
    __publicField(this, "report_only_provider");
    const use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.csp_provider = new CspProvider(use_hashes, directives, this.nonce);
    this.report_only_provider = new CspReportOnlyProvider(use_hashes, reportOnly, this.nonce);
  }
  get script_needs_nonce() {
    return this.csp_provider.script_needs_nonce || this.report_only_provider.script_needs_nonce;
  }
  get style_needs_nonce() {
    return this.csp_provider.style_needs_nonce || this.report_only_provider.style_needs_nonce;
  }
  /** @param {string} content */
  add_script(content) {
    this.csp_provider.add_script(content);
    this.report_only_provider.add_script(content);
  }
  /** @param {string} content */
  add_style(content) {
    this.csp_provider.add_style(content);
    this.report_only_provider.add_style(content);
  }
};
function defer() {
  let fulfil;
  let reject;
  const promise = new Promise((f, r) => {
    fulfil = f;
    reject = r;
  });
  return { promise, fulfil, reject };
}
function create_async_iterator() {
  const deferred = [defer()];
  return {
    iterator: {
      [Symbol.asyncIterator]() {
        return {
          next: async () => {
            const next = await deferred[0].promise;
            if (!next.done)
              deferred.shift();
            return next;
          }
        };
      }
    },
    push: (value) => {
      deferred[deferred.length - 1].fulfil({
        value,
        done: false
      });
      deferred.push(defer());
    },
    done: () => {
      deferred[deferred.length - 1].fulfil({ done: true });
    }
  };
}
var updated = {
  ...readable(false),
  check: () => false
};
var encoder$1 = new TextEncoder();
async function render_response({
  branch,
  fetched,
  options: options2,
  manifest: manifest2,
  state,
  page_config,
  status,
  error: error2 = null,
  event,
  resolve_opts,
  action_result
}) {
  if (state.prerendering) {
    if (options2.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options2.app_template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const { client } = manifest2._;
  const modulepreloads = new Set(client.imports);
  const stylesheets21 = new Set(client.stylesheets);
  const fonts21 = new Set(client.fonts);
  const link_header_preloads = /* @__PURE__ */ new Set();
  const inline_styles = /* @__PURE__ */ new Map();
  let rendered;
  const form_value = action_result?.type === "success" || action_result?.type === "failure" ? action_result.data ?? null : null;
  let base$1 = base;
  let assets$1 = assets;
  let base_expression = s(base);
  if (!state.prerendering?.fallback) {
    const segments = event.url.pathname.slice(base.length).split("/").slice(2);
    base$1 = segments.map(() => "..").join("/") || ".";
    base_expression = `new URL(${s(base$1)}, location).pathname.slice(0, -1)`;
    if (!assets || assets[0] === "/" && assets !== SVELTE_KIT_ASSETS) {
      assets$1 = base$1;
    }
  }
  if (page_config.ssr) {
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        updated
      },
      constructors: await Promise.all(branch.map(({ node }) => node.component())),
      form: form_value
    };
    let data2 = {};
    for (let i = 0; i < branch.length; i += 1) {
      data2 = { ...data2, ...branch[i].data };
      props[`data_${i}`] = data2;
    }
    props.page = {
      error: error2,
      params: (
        /** @type {Record<string, any>} */
        event.params
      ),
      route: event.route,
      status,
      url: event.url,
      data: data2,
      form: form_value
    };
    {
      try {
        rendered = options2.root.render(props);
      } finally {
        reset();
      }
    }
    for (const { node } of branch) {
      for (const url of node.imports)
        modulepreloads.add(url);
      for (const url of node.stylesheets)
        stylesheets21.add(url);
      for (const url of node.fonts)
        fonts21.add(url);
      if (node.inline_styles) {
        Object.entries(await node.inline_styles()).forEach(([k, v]) => inline_styles.set(k, v));
      }
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let head = "";
  let body = rendered.html;
  const csp = new Csp(options2.csp, {
    prerender: !!state.prerendering
  });
  const prefixed = (path) => {
    if (path.startsWith("/")) {
      return base + path;
    }
    return `${assets$1}/${path}`;
  };
  if (inline_styles.size > 0) {
    const content = Array.from(inline_styles.values()).join("\n");
    const attributes = [];
    if (csp.style_needs_nonce)
      attributes.push(` nonce="${csp.nonce}"`);
    csp.add_style(content);
    head += `
	<style${attributes.join("")}>${content}</style>`;
  }
  for (const dep of stylesheets21) {
    const path = prefixed(dep);
    const attributes = ['rel="stylesheet"'];
    if (inline_styles.has(dep)) {
      attributes.push("disabled", 'media="(max-width: 0)"');
    } else {
      if (resolve_opts.preload({ type: "css", path })) {
        const preload_atts = ['rel="preload"', 'as="style"'];
        link_header_preloads.add(`<${encodeURI(path)}>; ${preload_atts.join(";")}; nopush`);
      }
    }
    head += `
		<link href="${path}" ${attributes.join(" ")}>`;
  }
  for (const dep of fonts21) {
    const path = prefixed(dep);
    if (resolve_opts.preload({ type: "font", path })) {
      const ext = dep.slice(dep.lastIndexOf(".") + 1);
      const attributes = [
        'rel="preload"',
        'as="font"',
        `type="font/${ext}"`,
        `href="${path}"`,
        "crossorigin"
      ];
      head += `
		<link ${attributes.join(" ")}>`;
    }
  }
  const global2 = `__sveltekit_${options2.version_hash}`;
  const { data, chunks } = get_data(
    event,
    options2,
    branch.map((b) => b.server_data),
    global2
  );
  if (page_config.ssr && page_config.csr) {
    body += `
			${fetched.map(
      (item) => serialize_data(item, resolve_opts.filterSerializedResponseHeaders, !!state.prerendering)
    ).join("\n			")}`;
  }
  if (page_config.csr) {
    const included_modulepreloads = Array.from(modulepreloads, (dep) => prefixed(dep)).filter(
      (path) => resolve_opts.preload({ type: "js", path })
    );
    for (const path of included_modulepreloads) {
      link_header_preloads.add(`<${encodeURI(path)}>; rel="modulepreload"; nopush`);
      if (options2.preload_strategy !== "modulepreload") {
        head += `
		<link rel="preload" as="script" crossorigin="anonymous" href="${path}">`;
      } else if (state.prerendering) {
        head += `
		<link rel="modulepreload" href="${path}">`;
      }
    }
    const blocks = [];
    const properties = [
      assets && `assets: ${s(assets)}`,
      `base: ${base_expression}`,
      `env: ${s(public_env)}`
    ].filter(Boolean);
    if (chunks) {
      blocks.push("const deferred = new Map();");
      properties.push(`defer: (id) => new Promise((fulfil, reject) => {
							deferred.set(id, { fulfil, reject });
						})`);
      properties.push(`resolve: ({ id, data, error }) => {
							const { fulfil, reject } = deferred.get(id);
							deferred.delete(id);

							if (error) reject(error);
							else fulfil(data);
						}`);
    }
    blocks.push(`${global2} = {
						${properties.join(",\n						")}
					};`);
    const args = ["app", "element"];
    blocks.push("const element = document.currentScript.parentElement;");
    if (page_config.ssr) {
      const serialized = { form: "null", error: "null" };
      blocks.push(`const data = ${data};`);
      if (form_value) {
        serialized.form = uneval_action_response(
          form_value,
          /** @type {string} */
          event.route.id
        );
      }
      if (error2) {
        serialized.error = uneval(error2);
      }
      const hydrate = [
        `node_ids: [${branch.map(({ node }) => node.index).join(", ")}]`,
        "data",
        `form: ${serialized.form}`,
        `error: ${serialized.error}`
      ];
      if (status !== 200) {
        hydrate.push(`status: ${status}`);
      }
      if (options2.embedded) {
        hydrate.push(`params: ${uneval(event.params)}`, `route: ${s(event.route)}`);
      }
      args.push(`{
							${hydrate.join(",\n							")}
						}`);
    }
    blocks.push(`Promise.all([
						import(${s(prefixed(client.start))}),
						import(${s(prefixed(client.app))})
					]).then(([kit, app]) => {
						kit.start(${args.join(", ")});
					});`);
    if (options2.service_worker) {
      const opts = "";
      blocks.push(`if ('serviceWorker' in navigator) {
						addEventListener('load', function () {
							navigator.serviceWorker.register('${prefixed("service-worker.js")}'${opts});
						});
					}`);
    }
    const init_app = `
				{
					${blocks.join("\n\n					")}
				}
			`;
    csp.add_script(init_app);
    body += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_app}<\/script>
		`;
  }
  const headers = new Headers({
    "x-sveltekit-page": "true",
    "content-type": "text/html"
  });
  if (state.prerendering) {
    const http_equiv = [];
    const csp_headers = csp.csp_provider.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (state.prerendering.cache) {
      http_equiv.push(`<meta http-equiv="cache-control" content="${state.prerendering.cache}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  } else {
    const csp_header = csp.csp_provider.get_header();
    if (csp_header) {
      headers.set("content-security-policy", csp_header);
    }
    const report_only_header = csp.report_only_provider.get_header();
    if (report_only_header) {
      headers.set("content-security-policy-report-only", report_only_header);
    }
    if (link_header_preloads.size) {
      headers.set("link", Array.from(link_header_preloads).join(", "));
    }
  }
  head += rendered.head;
  const html = options2.templates.app({
    head,
    body,
    assets: assets$1,
    nonce: (
      /** @type {string} */
      csp.nonce
    ),
    env: public_env
  });
  const transformed = await resolve_opts.transformPageChunk({
    html,
    done: true
  }) || "";
  if (!chunks) {
    headers.set("etag", `"${hash(transformed)}"`);
  }
  return !chunks ? text(transformed, {
    status,
    headers
  }) : new Response(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder$1.encode(transformed + "\n"));
        for await (const chunk of chunks) {
          controller.enqueue(encoder$1.encode(chunk));
        }
        controller.close();
      },
      type: "bytes"
    }),
    {
      headers: {
        "content-type": "text/html"
      }
    }
  );
}
function get_data(event, options2, nodes, global2) {
  let promise_id = 1;
  let count = 0;
  const { iterator, push, done } = create_async_iterator();
  function replacer(thing) {
    if (typeof thing?.then === "function") {
      const id = promise_id++;
      count += 1;
      thing.then(
        /** @param {any} data */
        (data) => ({ data })
      ).catch(
        /** @param {any} error */
        async (error2) => ({
          error: await handle_error_and_jsonify(event, options2, error2)
        })
      ).then(
        /**
         * @param {{data: any; error: any}} result
         */
        async ({ data, error: error2 }) => {
          count -= 1;
          let str;
          try {
            str = uneval({ id, data, error: error2 }, replacer);
          } catch (e) {
            error2 = await handle_error_and_jsonify(
              event,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            data = void 0;
            str = uneval({ id, data, error: error2 }, replacer);
          }
          push(`<script>${global2}.resolve(${str})<\/script>
`);
          if (count === 0)
            done();
        }
      );
      return `${global2}.defer(${id})`;
    }
  }
  try {
    const strings = nodes.map((node) => {
      if (!node)
        return "null";
      return `{"type":"data","data":${uneval(node.data, replacer)},${stringify_uses(node)}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
    });
    return {
      data: `[${strings.join(",")}]`,
      chunks: count > 0 ? iterator : null
    };
  } catch (e) {
    throw new Error(clarify_devalue_error(
      event,
      /** @type {any} */
      e
    ));
  }
}
function get_option(nodes, option) {
  return nodes.reduce(
    (value, node) => {
      return (
        /** @type {Value} TypeScript's too dumb to understand this */
        node?.universal?.[option] ?? node?.server?.[option] ?? value
      );
    },
    /** @type {Value | undefined} */
    void 0
  );
}
async function respond_with_error({
  event,
  options: options2,
  manifest: manifest2,
  state,
  status,
  error: error2,
  resolve_opts
}) {
  const fetched = [];
  try {
    const branch = [];
    const default_layout = await manifest2._.nodes[0]();
    const ssr = get_option([default_layout], "ssr") ?? true;
    const csr = get_option([default_layout], "csr") ?? true;
    if (ssr) {
      state.error = true;
      const server_data_promise = load_server_data({
        event,
        state,
        node: default_layout,
        parent: async () => ({}),
        track_server_fetches: options2.track_server_fetches
      });
      const server_data = await server_data_promise;
      const data = await load_data({
        event,
        fetched,
        node: default_layout,
        parent: async () => ({}),
        resolve_opts,
        server_data_promise,
        state,
        csr
      });
      branch.push(
        {
          node: default_layout,
          server_data,
          data
        },
        {
          node: await manifest2._.nodes[1](),
          // 1 is always the root error
          data: null,
          server_data: null
        }
      );
    }
    return await render_response({
      options: options2,
      manifest: manifest2,
      state,
      page_config: {
        ssr,
        csr: get_option([default_layout], "csr") ?? true
      },
      status,
      error: await handle_error_and_jsonify(event, options2, error2),
      branch,
      fetched,
      event,
      resolve_opts
    });
  } catch (e) {
    if (e instanceof Redirect) {
      return redirect_response(e.status, e.location);
    }
    return static_error_page(
      options2,
      e instanceof HttpError ? e.status : 500,
      (await handle_error_and_jsonify(event, options2, e)).message
    );
  }
}
function once(fn) {
  let done = false;
  let result;
  return () => {
    if (done)
      return result;
    done = true;
    return result = fn();
  };
}
var encoder3 = new TextEncoder();
async function render_data(event, route, options2, manifest2, state, invalidated_data_nodes, trailing_slash) {
  if (!route.page) {
    return new Response(void 0, {
      status: 404
    });
  }
  try {
    const node_ids = [...route.page.layouts, route.page.leaf];
    const invalidated = invalidated_data_nodes ?? node_ids.map(() => true);
    let aborted = false;
    const url = new URL(event.url);
    url.pathname = normalize_path(url.pathname, trailing_slash);
    const new_event = { ...event, url };
    const functions = node_ids.map((n, i) => {
      return once(async () => {
        try {
          if (aborted) {
            return (
              /** @type {import('types').ServerDataSkippedNode} */
              {
                type: "skip"
              }
            );
          }
          const node = n == void 0 ? n : await manifest2._.nodes[n]();
          return load_server_data({
            event: new_event,
            state,
            node,
            parent: async () => {
              const data2 = {};
              for (let j = 0; j < i; j += 1) {
                const parent = (
                  /** @type {import('types').ServerDataNode | null} */
                  await functions[j]()
                );
                if (parent) {
                  Object.assign(data2, parent.data);
                }
              }
              return data2;
            },
            track_server_fetches: options2.track_server_fetches
          });
        } catch (e) {
          aborted = true;
          throw e;
        }
      });
    });
    const promises = functions.map(async (fn, i) => {
      if (!invalidated[i]) {
        return (
          /** @type {import('types').ServerDataSkippedNode} */
          {
            type: "skip"
          }
        );
      }
      return fn();
    });
    let length = promises.length;
    const nodes = await Promise.all(
      promises.map(
        (p, i) => p.catch(async (error2) => {
          if (error2 instanceof Redirect) {
            throw error2;
          }
          length = Math.min(length, i + 1);
          return (
            /** @type {import('types').ServerErrorNode} */
            {
              type: "error",
              error: await handle_error_and_jsonify(event, options2, error2),
              status: error2 instanceof HttpError ? error2.status : void 0
            }
          );
        })
      )
    );
    const { data, chunks } = get_data_json(event, options2, nodes);
    if (!chunks) {
      return json_response(data);
    }
    return new Response(
      new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder3.encode(data));
          for await (const chunk of chunks) {
            controller.enqueue(encoder3.encode(chunk));
          }
          controller.close();
        },
        type: "bytes"
      }),
      {
        headers: {
          // we use a proprietary content type to prevent buffering.
          // the `text` prefix makes it inspectable
          "content-type": "text/sveltekit-data",
          "cache-control": "private, no-store"
        }
      }
    );
  } catch (e) {
    const error2 = normalize_error(e);
    if (error2 instanceof Redirect) {
      return redirect_json_response(error2);
    } else {
      return json_response(await handle_error_and_jsonify(event, options2, error2), 500);
    }
  }
}
function json_response(json2, status = 200) {
  return text(typeof json2 === "string" ? json2 : JSON.stringify(json2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "private, no-store"
    }
  });
}
function redirect_json_response(redirect2) {
  return json_response({
    type: "redirect",
    location: redirect2.location
  });
}
function get_data_json(event, options2, nodes) {
  let promise_id = 1;
  let count = 0;
  const { iterator, push, done } = create_async_iterator();
  const reducers = {
    /** @param {any} thing */
    Promise: (thing) => {
      if (typeof thing?.then === "function") {
        const id = promise_id++;
        count += 1;
        let key2 = "data";
        thing.catch(
          /** @param {any} e */
          async (e) => {
            key2 = "error";
            return handle_error_and_jsonify(
              event,
              options2,
              /** @type {any} */
              e
            );
          }
        ).then(
          /** @param {any} value */
          async (value) => {
            let str;
            try {
              str = stringify(value, reducers);
            } catch (e) {
              const error2 = await handle_error_and_jsonify(
                event,
                options2,
                new Error(`Failed to serialize promise while rendering ${event.route.id}`)
              );
              key2 = "error";
              str = stringify(error2, reducers);
            }
            count -= 1;
            push(`{"type":"chunk","id":${id},"${key2}":${str}}
`);
            if (count === 0)
              done();
          }
        );
        return id;
      }
    }
  };
  try {
    const strings = nodes.map((node) => {
      if (!node)
        return "null";
      if (node.type === "error" || node.type === "skip") {
        return JSON.stringify(node);
      }
      return `{"type":"data","data":${stringify(node.data, reducers)},${stringify_uses(
        node
      )}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
    });
    return {
      data: `{"type":"data","nodes":[${strings.join(",")}]}
`,
      chunks: count > 0 ? iterator : null
    };
  } catch (e) {
    throw new Error(clarify_devalue_error(
      event,
      /** @type {any} */
      e
    ));
  }
}
var MAX_DEPTH = 10;
async function render_page(event, page2, options2, manifest2, state, resolve_opts) {
  if (state.depth > MAX_DEPTH) {
    return text(`Not found: ${event.url.pathname}`, {
      status: 404
      // TODO in some cases this should be 500. not sure how to differentiate
    });
  }
  if (is_action_json_request(event)) {
    const node = await manifest2._.nodes[page2.leaf]();
    return handle_action_json_request(event, options2, node?.server);
  }
  try {
    const nodes = await Promise.all([
      // we use == here rather than === because [undefined] serializes as "[null]"
      ...page2.layouts.map((n) => n == void 0 ? n : manifest2._.nodes[n]()),
      manifest2._.nodes[page2.leaf]()
    ]);
    const leaf_node = (
      /** @type {import('types').SSRNode} */
      nodes.at(-1)
    );
    let status = 200;
    let action_result = void 0;
    if (is_action_request(event)) {
      action_result = await handle_action_request(event, leaf_node.server);
      if (action_result?.type === "redirect") {
        return redirect_response(action_result.status, action_result.location);
      }
      if (action_result?.type === "error") {
        const error2 = action_result.error;
        status = error2 instanceof HttpError ? error2.status : 500;
      }
      if (action_result?.type === "failure") {
        status = action_result.status;
      }
    }
    const should_prerender_data = nodes.some((node) => node?.server);
    const data_pathname = add_data_suffix(event.url.pathname);
    const should_prerender = get_option(nodes, "prerender") ?? false;
    if (should_prerender) {
      const mod = leaf_node.server;
      if (mod?.actions) {
        throw new Error("Cannot prerender pages with actions");
      }
    } else if (state.prerendering) {
      return new Response(void 0, {
        status: 204
      });
    }
    state.prerender_default = should_prerender;
    const fetched = [];
    if (get_option(nodes, "ssr") === false) {
      return await render_response({
        branch: [],
        fetched,
        page_config: {
          ssr: false,
          csr: get_option(nodes, "csr") ?? true
        },
        status,
        error: null,
        event,
        options: options2,
        manifest: manifest2,
        state,
        resolve_opts
      });
    }
    const branch = [];
    let load_error = null;
    const server_promises = nodes.map((node, i) => {
      if (load_error) {
        throw load_error;
      }
      return Promise.resolve().then(async () => {
        try {
          if (node === leaf_node && action_result?.type === "error") {
            throw action_result.error;
          }
          return await load_server_data({
            event,
            state,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                const parent = await server_promises[j];
                if (parent)
                  Object.assign(data, await parent.data);
              }
              return data;
            },
            track_server_fetches: options2.track_server_fetches
          });
        } catch (e) {
          load_error = /** @type {Error} */
          e;
          throw load_error;
        }
      });
    });
    const csr = get_option(nodes, "csr") ?? true;
    const load_promises = nodes.map((node, i) => {
      if (load_error)
        throw load_error;
      return Promise.resolve().then(async () => {
        try {
          return await load_data({
            event,
            fetched,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                Object.assign(data, await load_promises[j]);
              }
              return data;
            },
            resolve_opts,
            server_data_promise: server_promises[i],
            state,
            csr
          });
        } catch (e) {
          load_error = /** @type {Error} */
          e;
          throw load_error;
        }
      });
    });
    for (const p of server_promises)
      p.catch(() => {
      });
    for (const p of load_promises)
      p.catch(() => {
      });
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node) {
        try {
          const server_data = await server_promises[i];
          const data = await load_promises[i];
          branch.push({ node, server_data, data });
        } catch (e) {
          const err = normalize_error(e);
          if (err instanceof Redirect) {
            if (state.prerendering && should_prerender_data) {
              const body = JSON.stringify({
                type: "redirect",
                location: err.location
              });
              state.prerendering.dependencies.set(data_pathname, {
                response: text(body),
                body
              });
            }
            return redirect_response(err.status, err.location);
          }
          const status2 = err instanceof HttpError ? err.status : 500;
          const error2 = await handle_error_and_jsonify(event, options2, err);
          while (i--) {
            if (page2.errors[i]) {
              const index21 = (
                /** @type {number} */
                page2.errors[i]
              );
              const node2 = await manifest2._.nodes[index21]();
              let j = i;
              while (!branch[j])
                j -= 1;
              return await render_response({
                event,
                options: options2,
                manifest: manifest2,
                state,
                resolve_opts,
                page_config: { ssr: true, csr: true },
                status: status2,
                error: error2,
                branch: compact(branch.slice(0, j + 1)).concat({
                  node: node2,
                  data: null,
                  server_data: null
                }),
                fetched
              });
            }
          }
          return static_error_page(options2, status2, error2.message);
        }
      } else {
        branch.push(null);
      }
    }
    if (state.prerendering && should_prerender_data) {
      let { data, chunks } = get_data_json(
        event,
        options2,
        branch.map((node) => node?.server_data)
      );
      if (chunks) {
        for await (const chunk of chunks) {
          data += chunk;
        }
      }
      state.prerendering.dependencies.set(data_pathname, {
        response: text(data),
        body: data
      });
    }
    return await render_response({
      event,
      options: options2,
      manifest: manifest2,
      state,
      resolve_opts,
      page_config: {
        csr: get_option(nodes, "csr") ?? true,
        ssr: true
      },
      status,
      error: null,
      branch: compact(branch),
      action_result,
      fetched
    });
  } catch (e) {
    return await respond_with_error({
      event,
      options: options2,
      manifest: manifest2,
      state,
      status: 500,
      error: e,
      resolve_opts
    });
  }
}
function get_cookies(request, url, trailing_slash) {
  const header = request.headers.get("cookie") ?? "";
  const initial_cookies = (0, import_cookie3.parse)(header, { decode: (value) => value });
  const normalized_url = normalize_path(url.pathname, trailing_slash);
  const default_path = normalized_url.split("/").slice(0, -1).join("/") || "/";
  const new_cookies = {};
  const defaults = {
    httpOnly: true,
    sameSite: "lax",
    secure: url.hostname === "localhost" && url.protocol === "http:" ? false : true
  };
  const cookies = {
    // The JSDoc param annotations appearing below for get, set and delete
    // are necessary to expose the `cookie` library types to
    // typescript users. `@type {import('@sveltejs/kit').Cookies}` above is not
    // sufficient to do so.
    /**
     * @param {string} name
     * @param {import('cookie').CookieParseOptions} opts
     */
    get(name, opts) {
      const c = new_cookies[name];
      if (c && domain_matches(url.hostname, c.options.domain) && path_matches(url.pathname, c.options.path)) {
        return c.value;
      }
      const decoder2 = opts?.decode || decodeURIComponent;
      const req_cookies = (0, import_cookie3.parse)(header, { decode: decoder2 });
      const cookie = req_cookies[name];
      return cookie;
    },
    /**
     * @param {import('cookie').CookieParseOptions} opts
     */
    getAll(opts) {
      const decoder2 = opts?.decode || decodeURIComponent;
      const cookies2 = (0, import_cookie3.parse)(header, { decode: decoder2 });
      for (const c of Object.values(new_cookies)) {
        if (domain_matches(url.hostname, c.options.domain) && path_matches(url.pathname, c.options.path)) {
          cookies2[c.name] = c.value;
        }
      }
      return Object.entries(cookies2).map(([name, value]) => ({ name, value }));
    },
    /**
     * @param {string} name
     * @param {string} value
     * @param {import('cookie').CookieSerializeOptions} opts
     */
    set(name, value, opts = {}) {
      set_internal(name, value, { ...defaults, ...opts });
    },
    /**
     * @param {string} name
     * @param {import('cookie').CookieSerializeOptions} opts
     */
    delete(name, opts = {}) {
      cookies.set(name, "", {
        ...opts,
        maxAge: 0
      });
    },
    /**
     * @param {string} name
     * @param {string} value
     * @param {import('cookie').CookieSerializeOptions} opts
     */
    serialize(name, value, opts) {
      return (0, import_cookie3.serialize)(name, value, {
        ...defaults,
        ...opts
      });
    }
  };
  function get_cookie_header(destination, header2) {
    const combined_cookies = {
      // cookies sent by the user agent have lowest precedence
      ...initial_cookies
    };
    for (const key2 in new_cookies) {
      const cookie = new_cookies[key2];
      if (!domain_matches(destination.hostname, cookie.options.domain))
        continue;
      if (!path_matches(destination.pathname, cookie.options.path))
        continue;
      const encoder22 = cookie.options.encode || encodeURIComponent;
      combined_cookies[cookie.name] = encoder22(cookie.value);
    }
    if (header2) {
      const parsed = (0, import_cookie3.parse)(header2, { decode: (value) => value });
      for (const name in parsed) {
        combined_cookies[name] = parsed[name];
      }
    }
    return Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
  }
  function set_internal(name, value, opts) {
    const path = opts.path ?? default_path;
    new_cookies[name] = {
      name,
      value,
      options: {
        ...opts,
        path
      }
    };
  }
  return { cookies, new_cookies, get_cookie_header, set_internal };
}
function domain_matches(hostname, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized)
    return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized)
    return true;
  return path.startsWith(normalized + "/");
}
function add_cookies_to_headers(headers, cookies) {
  for (const new_cookie of cookies) {
    const { name, value, options: options2 } = new_cookie;
    headers.append("set-cookie", (0, import_cookie3.serialize)(name, value, options2));
  }
}
function create_fetch({ event, options: options2, manifest: manifest2, state, get_cookie_header, set_internal }) {
  return async (info, init2) => {
    const original_request = normalize_fetch_input(info, init2, event.url);
    let mode = (info instanceof Request ? info.mode : init2?.mode) ?? "cors";
    let credentials = (info instanceof Request ? info.credentials : init2?.credentials) ?? "same-origin";
    return await options2.hooks.handleFetch({
      event,
      request: original_request,
      fetch: async (info2, init3) => {
        const request = normalize_fetch_input(info2, init3, event.url);
        const url = new URL(request.url);
        if (!request.headers.has("origin")) {
          request.headers.set("origin", event.url.origin);
        }
        if (info2 !== original_request) {
          mode = (info2 instanceof Request ? info2.mode : init3?.mode) ?? "cors";
          credentials = (info2 instanceof Request ? info2.credentials : init3?.credentials) ?? "same-origin";
        }
        if ((request.method === "GET" || request.method === "HEAD") && (mode === "no-cors" && url.origin !== event.url.origin || url.origin === event.url.origin)) {
          request.headers.delete("origin");
        }
        if (url.origin !== event.url.origin) {
          if (`.${url.hostname}`.endsWith(`.${event.url.hostname}`) && credentials !== "omit") {
            const cookie = get_cookie_header(url, request.headers.get("cookie"));
            if (cookie)
              request.headers.set("cookie", cookie);
          }
          return fetch(request);
        }
        const prefix2 = assets || base;
        const decoded = decodeURIComponent(url.pathname);
        const filename = (decoded.startsWith(prefix2) ? decoded.slice(prefix2.length) : decoded).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = manifest2.assets.has(filename);
        const is_asset_html = manifest2.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (state.read) {
            const type = is_asset ? manifest2.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            return new Response(state.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          }
          return await fetch(request);
        }
        if (credentials !== "omit") {
          const cookie = get_cookie_header(url, request.headers.get("cookie"));
          if (cookie) {
            request.headers.set("cookie", cookie);
          }
          const authorization = event.request.headers.get("authorization");
          if (authorization && !request.headers.has("authorization")) {
            request.headers.set("authorization", authorization);
          }
        }
        if (!request.headers.has("accept")) {
          request.headers.set("accept", "*/*");
        }
        if (!request.headers.has("accept-language")) {
          request.headers.set(
            "accept-language",
            /** @type {string} */
            event.request.headers.get("accept-language")
          );
        }
        const response = await respond(request, options2, manifest2, {
          ...state,
          depth: state.depth + 1
        });
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          for (const str of set_cookie_parser.splitCookiesString(set_cookie)) {
            const { name, value, ...options3 } = set_cookie_parser.parseString(str);
            set_internal(
              name,
              value,
              /** @type {import('cookie').CookieSerializeOptions} */
              options3
            );
          }
        }
        return response;
      }
    });
  };
}
function normalize_fetch_input(info, init2, url) {
  if (info instanceof Request) {
    return info;
  }
  return new Request(typeof info === "string" ? new URL(info, url) : info, init2);
}
function validator(expected) {
  function validate(module, file) {
    if (!module)
      return;
    for (const key2 in module) {
      if (key2[0] === "_" || expected.has(key2))
        continue;
      const values = [...expected.values()];
      const hint = hint_for_supported_files(key2, file?.slice(file.lastIndexOf("."))) ?? `valid exports are ${values.join(", ")}, or anything with a '_' prefix`;
      throw new Error(`Invalid export '${key2}'${file ? ` in ${file}` : ""} (${hint})`);
    }
  }
  return validate;
}
function hint_for_supported_files(key2, ext = ".js") {
  const supported_files = [];
  if (valid_layout_exports.has(key2)) {
    supported_files.push(`+layout${ext}`);
  }
  if (valid_page_exports.has(key2)) {
    supported_files.push(`+page${ext}`);
  }
  if (valid_layout_server_exports.has(key2)) {
    supported_files.push(`+layout.server${ext}`);
  }
  if (valid_page_server_exports.has(key2)) {
    supported_files.push(`+page.server${ext}`);
  }
  if (valid_server_exports.has(key2)) {
    supported_files.push(`+server${ext}`);
  }
  if (supported_files.length > 0) {
    return `'${key2}' is a valid export in ${supported_files.slice(0, -1).join(", ")}${supported_files.length > 1 ? " or " : ""}${supported_files.at(-1)}`;
  }
}
var valid_layout_exports = /* @__PURE__ */ new Set([
  "load",
  "prerender",
  "csr",
  "ssr",
  "trailingSlash",
  "config"
]);
var valid_page_exports = /* @__PURE__ */ new Set([...valid_layout_exports, "entries"]);
var valid_layout_server_exports = /* @__PURE__ */ new Set([...valid_layout_exports]);
var valid_page_server_exports = /* @__PURE__ */ new Set([...valid_layout_server_exports, "actions", "entries"]);
var valid_server_exports = /* @__PURE__ */ new Set([
  "GET",
  "POST",
  "PATCH",
  "PUT",
  "DELETE",
  "OPTIONS",
  "HEAD",
  "fallback",
  "prerender",
  "trailingSlash",
  "config",
  "entries"
]);
var validate_layout_exports = validator(valid_layout_exports);
var validate_page_exports = validator(valid_page_exports);
var validate_layout_server_exports = validator(valid_layout_server_exports);
var validate_page_server_exports = validator(valid_page_server_exports);
var validate_server_exports = validator(valid_server_exports);
var default_transform = ({ html }) => html;
var default_filter = () => false;
var default_preload = ({ type }) => type === "js" || type === "css";
var page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "POST"]);
var allowed_page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
async function respond(request, options2, manifest2, state) {
  const url = new URL(request.url);
  if (options2.csrf_check_origin) {
    const forbidden = is_form_content_type(request) && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request.headers.get("origin") !== url.origin;
    if (forbidden) {
      const csrf_error = error(403, `Cross-site ${request.method} form submissions are forbidden`);
      if (request.headers.get("accept") === "application/json") {
        return json(csrf_error.body, { status: csrf_error.status });
      }
      return text(csrf_error.body.message, { status: csrf_error.status });
    }
  }
  let decoded;
  try {
    decoded = decode_pathname(url.pathname);
  } catch {
    return text("Malformed URI", { status: 400 });
  }
  let route = null;
  let params = {};
  if (base && !state.prerendering?.fallback) {
    if (!decoded.startsWith(base)) {
      return text("Not found", { status: 404 });
    }
    decoded = decoded.slice(base.length) || "/";
  }
  const is_data_request = has_data_suffix(decoded);
  let invalidated_data_nodes;
  if (is_data_request) {
    decoded = strip_data_suffix(decoded) || "/";
    url.pathname = strip_data_suffix(url.pathname) + (url.searchParams.get(TRAILING_SLASH_PARAM) === "1" ? "/" : "") || "/";
    url.searchParams.delete(TRAILING_SLASH_PARAM);
    invalidated_data_nodes = url.searchParams.get(INVALIDATED_PARAM)?.split("").map((node) => node === "1");
    url.searchParams.delete(INVALIDATED_PARAM);
  }
  if (!state.prerendering?.fallback) {
    const matchers = await manifest2._.matchers();
    for (const candidate of manifest2._.routes) {
      const match = candidate.pattern.exec(decoded);
      if (!match)
        continue;
      const matched = exec(match, candidate.params, matchers);
      if (matched) {
        route = candidate;
        params = decode_params(matched);
        break;
      }
    }
  }
  let trailing_slash = void 0;
  const headers = {};
  let cookies_to_add = {};
  const event = {
    // @ts-expect-error `cookies` and `fetch` need to be created after the `event` itself
    cookies: null,
    // @ts-expect-error
    fetch: null,
    getClientAddress: state.getClientAddress || (() => {
      throw new Error(
        `${"@sveltejs/adapter-netlify"} does not specify getClientAddress. Please raise an issue`
      );
    }),
    locals: {},
    params,
    platform: state.platform,
    request,
    route: { id: route?.id ?? null },
    setHeaders: (new_headers) => {
      for (const key2 in new_headers) {
        const lower = key2.toLowerCase();
        const value = new_headers[key2];
        if (lower === "set-cookie") {
          throw new Error(
            "Use `event.cookies.set(name, value, options)` instead of `event.setHeaders` to set cookies"
          );
        } else if (lower in headers) {
          throw new Error(`"${key2}" header is already set`);
        } else {
          headers[lower] = value;
          if (state.prerendering && lower === "cache-control") {
            state.prerendering.cache = /** @type {string} */
            value;
          }
        }
      }
    },
    url,
    isDataRequest: is_data_request,
    isSubRequest: state.depth > 0
  };
  let resolve_opts = {
    transformPageChunk: default_transform,
    filterSerializedResponseHeaders: default_filter,
    preload: default_preload
  };
  try {
    if (route) {
      if (url.pathname === base || url.pathname === base + "/") {
        trailing_slash = "always";
      } else if (route.page) {
        const nodes = await Promise.all([
          // we use == here rather than === because [undefined] serializes as "[null]"
          ...route.page.layouts.map((n) => n == void 0 ? n : manifest2._.nodes[n]()),
          manifest2._.nodes[route.page.leaf]()
        ]);
        if (DEV)
          ;
        trailing_slash = get_option(nodes, "trailingSlash");
      } else if (route.endpoint) {
        const node = await route.endpoint();
        trailing_slash = node.trailingSlash;
        if (DEV)
          ;
      }
      if (!is_data_request) {
        const normalized = normalize_path(url.pathname, trailing_slash ?? "never");
        if (normalized !== url.pathname && !state.prerendering?.fallback) {
          return new Response(void 0, {
            status: 308,
            headers: {
              "x-sveltekit-normalize": "1",
              location: (
                // ensure paths starting with '//' are not treated as protocol-relative
                (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
              )
            }
          });
        }
      }
    }
    const { cookies, new_cookies, get_cookie_header, set_internal } = get_cookies(
      request,
      url,
      trailing_slash ?? "never"
    );
    cookies_to_add = new_cookies;
    event.cookies = cookies;
    event.fetch = create_fetch({
      event,
      options: options2,
      manifest: manifest2,
      state,
      get_cookie_header,
      set_internal
    });
    if (state.prerendering && !state.prerendering.fallback)
      disable_search(url);
    const response = await options2.hooks.handle({
      event,
      resolve: (event2, opts) => resolve(event2, opts).then((response2) => {
        for (const key2 in headers) {
          const value = headers[key2];
          response2.headers.set(
            key2,
            /** @type {string} */
            value
          );
        }
        add_cookies_to_headers(response2.headers, Object.values(cookies_to_add));
        if (state.prerendering && event2.route.id !== null) {
          response2.headers.set("x-sveltekit-routeid", encodeURI(event2.route.id));
        }
        return response2;
      })
    });
    if (response.status === 200 && response.headers.has("etag")) {
      let if_none_match_value = request.headers.get("if-none-match");
      if (if_none_match_value?.startsWith('W/"')) {
        if_none_match_value = if_none_match_value.substring(2);
      }
      const etag = (
        /** @type {string} */
        response.headers.get("etag")
      );
      if (if_none_match_value === etag) {
        const headers2 = new Headers({ etag });
        for (const key2 of [
          "cache-control",
          "content-location",
          "date",
          "expires",
          "vary",
          "set-cookie"
        ]) {
          const value = response.headers.get(key2);
          if (value)
            headers2.set(key2, value);
        }
        return new Response(void 0, {
          status: 304,
          headers: headers2
        });
      }
    }
    if (is_data_request && response.status >= 300 && response.status <= 308) {
      const location = response.headers.get("location");
      if (location) {
        return redirect_json_response(new Redirect(
          /** @type {any} */
          response.status,
          location
        ));
      }
    }
    return response;
  } catch (e) {
    if (e instanceof Redirect) {
      const response = is_data_request ? redirect_json_response(e) : route?.page && is_action_json_request(event) ? action_json_redirect(e) : redirect_response(e.status, e.location);
      add_cookies_to_headers(response.headers, Object.values(cookies_to_add));
      return response;
    }
    return await handle_fatal_error(event, options2, e);
  }
  async function resolve(event2, opts) {
    try {
      if (opts) {
        if ("ssr" in opts) {
          throw new Error(
            "ssr has been removed, set it in the appropriate +layout.js instead. See the PR for more information: https://github.com/sveltejs/kit/pull/6197"
          );
        }
        resolve_opts = {
          transformPageChunk: opts.transformPageChunk || default_transform,
          filterSerializedResponseHeaders: opts.filterSerializedResponseHeaders || default_filter,
          preload: opts.preload || default_preload
        };
      }
      if (state.prerendering?.fallback) {
        return await render_response({
          event: event2,
          options: options2,
          manifest: manifest2,
          state,
          page_config: { ssr: false, csr: true },
          status: 200,
          error: null,
          branch: [],
          fetched: [],
          resolve_opts
        });
      }
      if (route) {
        const method = (
          /** @type {import('types').HttpMethod} */
          event2.request.method
        );
        let response;
        if (is_data_request) {
          response = await render_data(
            event2,
            route,
            options2,
            manifest2,
            state,
            invalidated_data_nodes,
            trailing_slash ?? "never"
          );
        } else if (route.endpoint && (!route.page || is_endpoint_request(event2))) {
          response = await render_endpoint(event2, await route.endpoint(), state);
        } else if (route.page) {
          if (page_methods.has(method)) {
            response = await render_page(event2, route.page, options2, manifest2, state, resolve_opts);
          } else {
            const allowed_methods2 = new Set(allowed_page_methods);
            const node = await manifest2._.nodes[route.page.leaf]();
            if (node?.server?.actions) {
              allowed_methods2.add("POST");
            }
            if (method === "OPTIONS") {
              response = new Response(null, {
                status: 204,
                headers: {
                  allow: Array.from(allowed_methods2.values()).join(", ")
                }
              });
            } else {
              const mod = [...allowed_methods2].reduce(
                (acc, curr) => {
                  acc[curr] = true;
                  return acc;
                },
                /** @type {Record<string, any>} */
                {}
              );
              response = method_not_allowed(mod, method);
            }
          }
        } else {
          throw new Error("This should never happen");
        }
        if (request.method === "GET" && route.page && route.endpoint) {
          const vary = response.headers.get("vary")?.split(",")?.map((v) => v.trim().toLowerCase());
          if (!(vary?.includes("accept") || vary?.includes("*"))) {
            response = new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: new Headers(response.headers)
            });
            response.headers.append("Vary", "Accept");
          }
        }
        return response;
      }
      if (state.error) {
        return text("Internal Server Error", {
          status: 500
        });
      }
      if (state.depth === 0) {
        return await respond_with_error({
          event: event2,
          options: options2,
          manifest: manifest2,
          state,
          status: 404,
          error: new Error(`Not found: ${event2.url.pathname}`),
          resolve_opts
        });
      }
      if (state.prerendering) {
        return text("not found", { status: 404 });
      }
      return await fetch(request);
    } catch (e) {
      return await handle_fatal_error(event2, options2, e);
    } finally {
      event2.cookies.set = () => {
        throw new Error("Cannot use `cookies.set(...)` after the response has been generated");
      };
      event2.setHeaders = () => {
        throw new Error("Cannot use `setHeaders(...)` after the response has been generated");
      };
    }
  }
}
function filter_private_env(env, { public_prefix, private_prefix }) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k]) => k.startsWith(private_prefix) && (public_prefix === "" || !k.startsWith(public_prefix))
    )
  );
}
function filter_public_env(env, { public_prefix, private_prefix }) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k]) => k.startsWith(public_prefix) && (private_prefix === "" || !k.startsWith(private_prefix))
    )
  );
}
var _options, _manifest;
var Server = class {
  /** @param {import('@sveltejs/kit').SSRManifest} manifest */
  constructor(manifest2) {
    /** @type {import('types').SSROptions} */
    __privateAdd(this, _options, void 0);
    /** @type {import('@sveltejs/kit').SSRManifest} */
    __privateAdd(this, _manifest, void 0);
    __privateSet(this, _options, options);
    __privateSet(this, _manifest, manifest2);
  }
  /**
   * @param {{
   *   env: Record<string, string>
   * }} opts
   */
  async init({ env }) {
    set_private_env(
      filter_private_env(env, {
        public_prefix: __privateGet(this, _options).env_public_prefix,
        private_prefix: __privateGet(this, _options).env_private_prefix
      })
    );
    set_public_env(
      filter_public_env(env, {
        public_prefix: __privateGet(this, _options).env_public_prefix,
        private_prefix: __privateGet(this, _options).env_private_prefix
      })
    );
    if (!__privateGet(this, _options).hooks) {
      try {
        const module = await get_hooks();
        __privateGet(this, _options).hooks = {
          handle: module.handle || (({ event, resolve }) => resolve(event)),
          handleError: module.handleError || (({ error: error2 }) => console.error(error2)),
          handleFetch: module.handleFetch || (({ request, fetch: fetch2 }) => fetch2(request))
        };
      } catch (error2) {
        {
          throw error2;
        }
      }
    }
  }
  /**
   * @param {Request} request
   * @param {import('types').RequestOptions} options
   */
  async respond(request, options2) {
    if (!(request instanceof Request)) {
      throw new Error(
        "The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details"
      );
    }
    return respond(request, __privateGet(this, _options), __privateGet(this, _manifest), {
      ...options2,
      error: false,
      depth: 0
    });
  }
};
_options = new WeakMap();
_manifest = new WeakMap();

// .svelte-kit/netlify-tmp/manifest.js
var manifest = (() => {
  function __memo(fn) {
    let value;
    return () => value ?? (value = value = fn());
  }
  return {
    appDir: "_app",
    appPath: "_app",
    assets: /* @__PURE__ */ new Set(["favicon.png", "fonts/Inter-roman.var.woff2", "ifcsg.svg", "logo.svg"]),
    mimeTypes: { ".png": "image/png", ".woff2": "font/woff2", ".svg": "image/svg+xml" },
    _: {
      client: { "start": "_app/immutable/entry/start.3aac350d.js", "app": "_app/immutable/entry/app.475fff3f.js", "imports": ["_app/immutable/entry/start.3aac350d.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/singletons.1311b0c2.js", "_app/immutable/chunks/index.a6216602.js", "_app/immutable/chunks/paths.3682a10a.js", "_app/immutable/entry/app.475fff3f.js", "_app/immutable/chunks/preload-helper.a4192956.js", "_app/immutable/chunks/scheduler.0c6a2dca.js", "_app/immutable/chunks/index.1043141f.js"], "stylesheets": [], "fonts": [] },
      nodes: [
        __memo(() => Promise.resolve().then(() => (init__(), __exports))),
        __memo(() => Promise.resolve().then(() => (init__2(), __exports2))),
        __memo(() => Promise.resolve().then(() => (init__3(), __exports3))),
        __memo(() => Promise.resolve().then(() => (init__4(), __exports4))),
        __memo(() => Promise.resolve().then(() => (init__5(), __exports5))),
        __memo(() => Promise.resolve().then(() => (init__6(), __exports6))),
        __memo(() => Promise.resolve().then(() => (init__7(), __exports7))),
        __memo(() => Promise.resolve().then(() => (init__8(), __exports8))),
        __memo(() => Promise.resolve().then(() => (init__9(), __exports9))),
        __memo(() => Promise.resolve().then(() => (init__10(), __exports10))),
        __memo(() => Promise.resolve().then(() => (init__11(), __exports11))),
        __memo(() => Promise.resolve().then(() => (init__12(), __exports12))),
        __memo(() => Promise.resolve().then(() => (init__13(), __exports13))),
        __memo(() => Promise.resolve().then(() => (init__14(), __exports14))),
        __memo(() => Promise.resolve().then(() => (init__15(), __exports15))),
        __memo(() => Promise.resolve().then(() => (init__16(), __exports16))),
        __memo(() => Promise.resolve().then(() => (init__17(), __exports17))),
        __memo(() => Promise.resolve().then(() => (init__18(), __exports18))),
        __memo(() => Promise.resolve().then(() => (init__19(), __exports19))),
        __memo(() => Promise.resolve().then(() => (init__20(), __exports20)))
      ],
      routes: [
        {
          id: "/(main)",
          pattern: /^\/?$/,
          params: [],
          page: { layouts: [0, 3], errors: [1, ,], leaf: 8 },
          endpoint: null
        },
        {
          id: "/(admin)/admin",
          pattern: /^\/admin\/?$/,
          params: [],
          page: { layouts: [0, 2], errors: [1, ,], leaf: 6 },
          endpoint: null
        },
        {
          id: "/(admin)/admin/api/delete-user",
          pattern: /^\/admin\/api\/delete-user\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server(), server_exports)))
        },
        {
          id: "/(admin)/admin/api/disable-user",
          pattern: /^\/admin\/api\/disable-user\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server2(), server_exports2)))
        },
        {
          id: "/(admin)/admin/api/invite-user-by-email",
          pattern: /^\/admin\/api\/invite-user-by-email\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server3(), server_exports3)))
        },
        {
          id: "/(admin)/admin/api/update-password",
          pattern: /^\/admin\/api\/update-password\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server4(), server_exports4)))
        },
        {
          id: "/(admin)/admin/api/update-role",
          pattern: /^\/admin\/api\/update-role\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server5(), server_exports5)))
        },
        {
          id: "/(admin)/admin/api/verify-email",
          pattern: /^\/admin\/api\/verify-email\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server6(), server_exports6)))
        },
        {
          id: "/(admin)/admin/users",
          pattern: /^\/admin\/users\/?$/,
          params: [],
          page: { layouts: [0, 2], errors: [1, ,], leaf: 7 },
          endpoint: null
        },
        {
          id: "/(main)/api/airtable",
          pattern: /^\/api\/airtable\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server7(), server_exports7)))
        },
        {
          id: "/(main)/api/auth/user-is-ban",
          pattern: /^\/api\/auth\/user-is-ban\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server8(), server_exports8)))
        },
        {
          id: "/(main)/api/ifcsg",
          pattern: /^\/api\/ifcsg\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server9(), server_exports9)))
        },
        {
          id: "/(main)/api/ifcsg/get-properties",
          pattern: /^\/api\/ifcsg\/get-properties\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server10(), server_exports10)))
        },
        {
          id: "/(main)/api/ifcsg/update-description",
          pattern: /^\/api\/ifcsg\/update-description\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server11(), server_exports11)))
        },
        {
          id: "/(main)/area-gfa",
          pattern: /^\/area-gfa\/?$/,
          params: [],
          page: { layouts: [0, 3], errors: [1, ,], leaf: 9 },
          endpoint: __memo(() => Promise.resolve().then(() => (init_server12(), server_exports12)))
        },
        {
          id: "/(main)/email-confirmed",
          pattern: /^\/email-confirmed\/?$/,
          params: [],
          page: { layouts: [0, 3], errors: [1, ,], leaf: 10 },
          endpoint: null
        },
        {
          id: "/(main)/ifcsg_old",
          pattern: /^\/ifcsg_old\/?$/,
          params: [],
          page: { layouts: [0, 3], errors: [1, ,], leaf: 12 },
          endpoint: null
        },
        {
          id: "/(main)/ifcsg",
          pattern: /^\/ifcsg\/?$/,
          params: [],
          page: { layouts: [0, 3], errors: [1, ,], leaf: 11 },
          endpoint: null
        },
        {
          id: "/(main)/login",
          pattern: /^\/login\/?$/,
          params: [],
          page: { layouts: [0, 3], errors: [1, ,], leaf: 13 },
          endpoint: null
        },
        {
          id: "/(main)/modellingguide",
          pattern: /^\/modellingguide\/?$/,
          params: [],
          page: { layouts: [0, 3, 4], errors: [1, , ,], leaf: 14 },
          endpoint: null
        },
        {
          id: "/(main)/modellingguide/[slug]",
          pattern: /^\/modellingguide\/([^/]+?)\/?$/,
          params: [{ "name": "slug", "optional": false, "rest": false, "chained": false }],
          page: { layouts: [0, 3, 4], errors: [1, , ,], leaf: 15 },
          endpoint: __memo(() => Promise.resolve().then(() => (init_server13(), server_exports13)))
        },
        {
          id: "/(main)/psets",
          pattern: /^\/psets\/?$/,
          params: [],
          page: { layouts: [0, 3], errors: [1, ,], leaf: 16 },
          endpoint: null
        },
        {
          id: "/(main)/spacename_old",
          pattern: /^\/spacename_old\/?$/,
          params: [],
          page: { layouts: [0, 3], errors: [1, ,], leaf: 19 },
          endpoint: null
        },
        {
          id: "/(main)/spacename",
          pattern: /^\/spacename\/?$/,
          params: [],
          page: { layouts: [0, 3, 5], errors: [1, , ,], leaf: 17 },
          endpoint: null
        },
        {
          id: "/(main)/spacename/[slug]",
          pattern: /^\/spacename\/([^/]+?)\/?$/,
          params: [{ "name": "slug", "optional": false, "rest": false, "chained": false }],
          page: { layouts: [0, 3, 5], errors: [1, , ,], leaf: 18 },
          endpoint: null
        }
      ],
      matchers: async () => {
        return {};
      }
    }
  };
})();
var prerendered = /* @__PURE__ */ new Set(["/temp", "/temp/__data.json"]);

// .svelte-kit/netlify-tmp/entry.js
var server = new Server(manifest);
var prefix = `/${manifest.appPath}/`;
var initialized = server.init({
  // @ts-ignore
  env: Deno.env.toObject()
});
async function handler(request, context) {
  if (is_static_file(request)) {
    return;
  }
  await initialized;
  return server.respond(request, {
    platform: { context },
    getClientAddress() {
      return context.ip;
    }
  });
}
function is_static_file(request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith(prefix)) {
    return true;
  }
  const pathname = url.pathname.replace(/\/$/, "");
  let file = pathname.substring(1);
  try {
    file = decodeURIComponent(file);
  } catch (err) {
  }
  return manifest.assets.has(file) || manifest.assets.has(file + "/index.html") || prerendered.has(pathname || "/");
}
export {
  handler as default
};
/*! Bundled license information:

@supabase/auth-helpers-shared/dist/index.mjs:
  (*! Bundled license information:
  
  cookie/index.js:
    (*!
     * cookie
     * Copyright(c) 2012-2014 Roman Shtylman
     * Copyright(c) 2015 Douglas Christopher Wilson
     * MIT Licensed
     *)
  *)

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=render.js.map
