//1.
//A.
let addTwoNumber = (a, b) => {
    return a + b;
}



//B.

let stringLength = (myStr) => {
    if (myStr.length < 10)
        return "short";
    return "long";
};


//2.  this function takes two numbers and then compares them to print the larger number. if a is greater than b, then a gets printed, if not, then b gets printed.


let fn = (a,b) => { a>b ? console.log(a) : console.log(b) }

//3. 

const arr_nums = [1,2,3,4,5];

const doublenums = arr_nums.map((num) => {
    return num*2;
});
