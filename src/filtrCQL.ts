/**
 * FiltrCQL provides filtres.compile() to compile user expressions to an CQL relation.
 * Based on FiltrES by Abe Haskins (https://github.com/abeisgoat/FiltrES.js)
 * Based on Filtrex by Joe Walnes (https://github.com/joewalnes/filtrex) 
 */
const Jison = require('jison');
type JParser = any;
const queryBase = "";
const queryEnd = "";
function filtrexParser(): JParser
{
    const code = function (args: any[], skipParentheses: boolean = true): string {
        const argsJs = args.map(
            (a: any) => typeof(a) == 'number' ? `$${a}` : `"${a}"` 
        ).join(',');

        return skipParentheses ?
            `$$ = [${argsJs}];` :
            `$$ = ["(", ${argsJs}, ")"];`;
    };
    return new Jison.Parser(
        {
            // Lexical tokens
            lex: {
                rules: [
                    ['\\(', 'return "(";'],
                    ['\\)', 'return ")";'],
                    ['\\,', 'return ",";'],
                    ['==', 'return "==";'],
                    ['\\!=', 'return "!=";'],
                    ['>=', 'return ">=";'],
                    ['<=', 'return "<=";'],
                    ['<', 'return "<";'],
                    ['>', 'return ">";'],
                    ['\\?', 'return "?";'],
                    ['\\:', 'return ":";'],
                    ['and[^\\w]', 'return "and";'],
                    // ['in[^\\w]', 'return "in";'],
    
                    ['\\s+',  ''], // skip whitespace
                    ['[0-9]+(?:\\.[0-9]+)?\\b', 'return "NUMBER";'], // 212.321
                    ['[a-zA-Z][\\.a-zA-Z0-9_]*', 'return "SYMBOL";'], // some.Symbol22
                    ['"(?:[^"])*"', 'yytext = yytext.substr(1, yyleng-2); return "STRING";'], // "foo"
    
                    // End
                    ['$', 'return "EOF";'],
                ]
            },
            // Operator precedence - lowest precedence first.
            // See http://www.gnu.org/software/bison/manual/html_node/Precedence.html
            // for a good explanation of how it works in Bison (and hence, Jison).
            // Different languages have different rules, but this seems a good starting
            // point: http://en.wikipedia.org/wiki/Order_of_operations#Programming_languages
            operators: [
                ['left', 'and'],
                ['left', 'in'],
                ['left', '==', '!='],
                ['left', '<', '<=', '>', '>=']
            ],
            // Grammar
            bnf: {
                expressions: [
                    ['e EOF', 'return $1;']
                ],
                e: [
                    ['e and e', code([1, ' AND ', 3 ])],
                    ['e == e' , code([1, ' = ', 3])],
                    ['e != e' , code([, 1, ' != ', 3 ])],
                    ['e < e'  , code([ 1, ' < ' , 3 ])],
                    ['e <= e' , code([1, ' <= ' , 3])],
                    ['e > e'  , code([1, ' > ' , 3])],
                    ['e >= e' , code([1, ' >= ' , 3])],
                    ['( e )'  , code([2], false)],
    
                    ['NUMBER' , code([1])],
                    ['STRING' , code(["'", 1, "'"])],
                    ['SYMBOL' , code([1])]
                ]
            }
        }
    );
}


function compileExpression(expression: string, failToQuerystring?: string )
{
    try {
        const tree = Parser.parse(expression);
        let js = [queryBase];
        const toJs = ( node: any ) => {
            if (Array.isArray(node)) {
                node.forEach(toJs);
            } else {
                js.push(node);
            }
        }
        tree.forEach(toJs);
        js.push(queryEnd);
        return js.join('');
    } catch (err) {
        throw "Invalid Query";
    }
}

const Parser = filtrexParser();
const filtrcql = {
    compile: compileExpression
};
export default filtrcql;
