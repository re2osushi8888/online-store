// このファイルはカスタムルールのテスト用です

// これらはエラーになるはずです
var abcdefg = "test";
let abcdefg2 = "test2";
const abcdefg = "test3";

function abcdefg() {
    return "function";
}

const obj = {
    abcdefg: "property"
};

const { abcdefg } = obj;

const arrow = (abcdefg) => {
    return abcdefg;
};

// これらは正常です
var validName = "test";
let anotherValidName = "test2";
const goodName = "test3";

function validFunction() {
    return "function";
} 