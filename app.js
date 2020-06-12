const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const output = [];
const questions = [
    {
      type: 'input',
      name: 'id',
      message: "Please enter id for employee:"
    },
    {
      type: 'input',
      name: 'name',
      message: "Please enter name for employee:"
    },
    {
      type: 'input',
      name: 'email',
      message: "Please enter email for employee:",
      validate: (input)=>{
        if (!ValidateEmail(input)){
          return "Please enter a valid email address format!"
        }else{
          return true
        }
      }
    },
    {
      type: 'list',
      name: 'role',
      message: "Please choose role for employee:",
      choices: ['Manager', 'Engineer', 'Intern']
    },
    {
      type: 'input',
      name: 'phone',
      message: "Please enter Manager's phone number:",
      when : (answers) =>{
        return answers.role === 'Manager';
        },
      validate: function(value) {
          var pass = value.match(
            /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
          );
          if (pass) {
            return true;
          }
          return 'Please enter a valid phone number';
        }
      },
    {
      type: 'input',
      name: 'github',
      message: "Please enter employee's github username:",
     when : (answers) =>{
        return answers.role === 'Engineer';
        }
    },
    {
      type: 'input',
      name: 'school',
      message: "Please enter intern's school:",
      when : (answers) =>{
        return answers.role === 'Intern';
        }
    },
    {
      type: 'confirm',
      name: 'askAgain',
      message: 'Would you like to enter another employee? (just hit enter for YES)?',
      default: true
    }
  ];

function ValidateEmail(mail){
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
      return true;
    }else
      return false;
  }

function ask() {
    inquirer.prompt(questions).then(answers => {
        output.push(answers);
        if (answers.askAgain) {
          ask();
        } else {
        // After the user has input all employees desired, call the `render` function (required
          const empList = createRoles(output);
          const htmlFile = render(empList);
        //   console.log(htmlFile)
          fs.writeFile(outputPath, htmlFile, 'utf8', (err) => err? console.log(err) : console.log('Team.html file completed'))
        }
      });
    }

function makeOutput() {
    if (!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR);
    }
}
function createRoles(employeeList) {
    const empList = [];
    employeeList.forEach(element => {
        if (element.role === "Manager"){
            const manager = new Manager(element.name, element.id, element.email, element.phone)
            empList.push(manager);
        }else if (element.role === "Intern"){
            const intern = new Intern(element.name, element.id, element.email, element.school)
            empList.push(intern);
        }else if (element.role === "Engineer"){
            const engineer = new Engineer(element.name, element.id, element.email, element.github)
            empList.push(engineer);
        }else{
    
        }
    });
    return empList;
}

makeOutput();
ask();

