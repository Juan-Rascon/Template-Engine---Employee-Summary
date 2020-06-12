const path = require("path");
const fs = require("fs");

const templatesDir = path.resolve(__dirname, "../templates");

const render = employees => {
  const mnghtml = [];
  const enghtml = [];
  const inthtml = [];
  
  mnghtml.push(employees
    .filter(employee => employee.getRole() === "Manager")
    .map((manager,index) => renderManager(manager,index))
  );
  enghtml.push(employees
    .filter(employee => employee.getRole() === "Engineer")
    .map((engineer,index) => renderEngineer(engineer,index))
  );
  inthtml.push(employees
    .filter(employee => employee.getRole() === "Intern")
    .map((intern, index) => renderIntern(intern, index))
  );
  const changes = {
    'Mgrteam': mnghtml.join(" "),
    'Engteam': enghtml.join(" "),
    'Intteam': inthtml.join(" ")
  }

  return renderMain(changes);

};

const renderManager = (manager,index) => {
  let template = fs.readFileSync(path.resolve(templatesDir, "manager.html"), "utf8");
  template = replacePlaceholders(template, "name", manager.getName());
  template = replacePlaceholders(template, "role", manager.getRole());
  template = replacePlaceholders(template, "email", manager.getEmail());
  template = replacePlaceholders(template, "id", manager.getId());
  template = replacePlaceholders(template, "officeNumber", manager.getOfficeNumber());
  return template;
};

const renderEngineer = (engineer, index) => {
  let template = fs.readFileSync(path.resolve(templatesDir, "engineer.html"), "utf8");
  template = replacePlaceholders(template, "name", engineer.getName());
  template = replacePlaceholders(template, "role", engineer.getRole());
  template = replacePlaceholders(template, "email", engineer.getEmail());
  template = replacePlaceholders(template, "id", engineer.getId());
  template = replacePlaceholders(template, "github", engineer.getGithub());
  return template;
};

const renderIntern = (intern, index) => {
  let template = fs.readFileSync(path.resolve(templatesDir, "intern.html"), "utf8");
  template = replacePlaceholders(template, "name", intern.getName());
  template = replacePlaceholders(template, "role", intern.getRole());
  template = replacePlaceholders(template, "email", intern.getEmail());
  template = replacePlaceholders(template, "id", intern.getId());
  template = replacePlaceholders(template, "school", intern.getSchool());
  return template;
};

const renderMain = (html) => {
  const template = fs.readFileSync(path.resolve(templatesDir, "main.html"), "utf8");
  return replacePlaceholders(template, html);
};

const replacePlaceholders = (template, placeholder, value) => {
  if (typeof placeholder === "string"){
    const pattern = new RegExp("{{ " + placeholder + " }}", "gm");
    return template.replace(pattern, value);
  } else {
    let workingTemplate = template
    for(const prop in placeholder){
      const pattern = new RegExp("{{ " + prop + " }}","gm");
      workingTemplate = workingTemplate.replace(pattern, placeholder[prop])
    }
    return workingTemplate;
  }
};

module.exports = render;
