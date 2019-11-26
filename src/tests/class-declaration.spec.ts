import { runTest } from './util';

const srcClassInit = `
class Employee {
    empCode: number;
    empName: string;
}

function main(): number {
    const a: Employee = {
        empCode: 42,
        empName: "dddd",
    };
    return a.empCode;
}
`;

const srcClassAsFunctionArgument = `
class Employee {
    empCode: number;
    empName: string;
}

function getEmpCode(emp: Employee): number {
    return emp.empCode
}

function main(): number {
    const a: Employee = {
        empCode: 42,
        empName: "dddd",
    };
    return getEmpCode(a);
}
`;

const srcClassInClass = `
class Employee {
    empCode: number;
    empName: string;
}

class Man {
    employee: Employee;
    name: string;
}

function main(): number {
    const e: Employee = {
        empCode: 42,
        empName: "dddd",
    };
    const m: Man = {
        employee: e,
        name: "jack",
    }
    return m.employee.empCode;
}
`;

const srcClassConstructor = `
class Employee {
    empCode: number;
    empName: string;

    constructor(empCode: number, empName: string) {
        this.empCode = empCode;
        this.empName = empName;
    }
}

function main(): number {
    const a = new Employee(42, "Mohanson");
    return a.empCode;
}
`;

runTest('test class: init', srcClassInit);
runTest('test class: as function argument', srcClassAsFunctionArgument);
runTest('test class: class in class', srcClassInClass);
runTest('test class: constructor', srcClassConstructor);