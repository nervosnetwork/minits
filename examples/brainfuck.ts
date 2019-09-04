// Inspired by this project: https://github.com/mohanson/brainfuck
//
// $ minits build examples/brainfuck.ts -o brainfuck.s
// $ clang brainfuck.s brainfuck
//
// $ ./brainfuck "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>."
// $ ./brainfuck ">++++[<++++++++>-]>++++++++[>++++<-]>>++>>>+>>>+<<<<<<<<<<[-[->+<]>[-<+>>>.<<]>>>[[->++++++++[>++++<-]>.<<[->+<]+>[->++++++++++<<+>]>.[-]>]]+<<<[-[->+<]+>[-<+>>>-[->+<]++>[-<->]<<<]<<<<]++++++++++.+++.[-]<]+++++"

const enum Opcode {
    SHR = '>',
    SHL = '<',
    ADD = '+',
    SUB = '-',
    PUTCHAR = '.',
    GETCHAR = ',',
    LB = '[',
    RB = ']',
}

function uint8(n: number): number {
    if (n > 0xff) {
        return uint8(n - 256);
    }
    if (n < 0x00) {
        return uint8(n + 256);
    }
    return n
}

function main(argc: number, argv: string[]): number {
    if (argc !== 2) {
        return 1;
    }
    let pc = 0;
    let ps = 0;

    // pre generated space: stack and src.
    let stack = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    let src = [
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    ];
    let arg1 = argv[1];
    for (let i = 0; i < strlen(arg1); i++) {
        src[i] = arg1[i];
    }

    for (; pc < strlen(arg1);) {
        let op = src[pc];
        if (op === Opcode.SHR) {
            ps += 1;
            pc += 1;
            continue
        }
        if (op === Opcode.SHL) {
            ps -= 1;
            pc += 1;
            continue
        }
        if (op === Opcode.ADD) {
            stack[ps] = uint8(stack[ps] + 1);
            pc += 1;
            continue
        }
        if (op === Opcode.SUB) {
            stack[ps] = uint8(stack[ps] - 1);
            pc += 1;
            continue
        }
        if (op === Opcode.PUTCHAR) {
            console.log('%c', stack[ps]);
            pc += 1;
            continue
        }
        if (op === Opcode.GETCHAR) {
            console.log('GETCHAR is disabled');
            return 1;
        }


        if (op === Opcode.LB) {
            if (stack[ps] != 0x00) {
                pc += 1;
                continue
            }
            let n = 1;
            for (; n !== 0;) {
                pc += 1;
                if (src[pc] === Opcode.LB) {
                    n += 1;
                    continue
                }
                if (src[pc] === Opcode.RB) {
                    n -= 1;
                    continue
                }
            }
            pc += 1;
            continue
        }
        if (op === Opcode.RB) {
            if (stack[ps] === 0x00) {
                pc += 1;
                continue
            }
            let n = 1;
            for (; n !== 0;) {
                pc -= 1;
                if (src[pc] === Opcode.RB) {
                    n += 1;
                    continue
                }
                if (src[pc] === Opcode.LB) {
                    n -= 1;
                    continue
                }
            }
            pc += 1;
            continue
        }
    }
    return 0;
}