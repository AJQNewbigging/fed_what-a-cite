const creationForm = document.getElementById("project-creation");

function findAll() {
    fetch('http://localhost:8080/project', {
            method: 'GET'
        }).then(response => {
            if (response.ok) return response.json();
            else throw new Error('Uh oh, something went wrong...');
        })
          .then(projects => {
            for (var i = 0; i < projects.length; i++) {
                createProjectBox(projects[i]);
            }
        })
          .catch(error => {
            console.log(error);
        });
}

function create() {
    fetch('http://localhost:8080/project', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(new FormData(creationForm))),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(response => {
            if (response.ok) window.location.reload();
            else throw new Error('Uh oh, something went wrong...');
        })
          .catch(error => {
            console.log(error);
        });
}

function createProjectBox(p) {
    var title = document.createElement("h5");
    title.appendChild(document.createTextNode(p.title))
    var dueDate = document.createElement("p");
    dueDate.appendChild(document.createTextNode("Due Date: " + p.dueDate))
    var desc = document.createElement("p");
    desc.appendChild(document.createTextNode(p.description));
    desc.classList.add("desc");

    var project = document.createElement("a");
    project.classList.add("box");
    project.appendChild(title);
    project.appendChild(dueDate);
    project.appendChild(desc);
    project.appendChild(createFormInput("hidden", "id", p.id))
    project.href = ""

    project.addEventListener('click', makeForm);
    var el = document.getElementById("box-list");
    el.appendChild(project);
}

function makeForm(event) {
    event.preventDefault();
    var el = event.target;
    var id = el.getElementsByTagName("input")[0].value;

    fetch(`http://localhost:8080/project/${id}`, {
        method: 'GET'
    }).then(response => {
        if (response.ok) return response.json();
        else throw new Error('Uh oh, something went wrong...');
    })
      .then(p => {
        var form = document.createElement("form");
        form.classList.add("box");
        form.classList.add("box-form");
        var description = document.createElement("textarea");
        description.name = "description";
        description.value = p.description;

        form.appendChild(createFormInput("hidden", "id", p.id));
        form.appendChild(createFormInput("text", "title", p.title));
        form.appendChild(createFormInput("date", "dueDate", p.dueDate));
        form.appendChild(description);
        form.appendChild(createFormInput("submit", "submit", "Submit"));

        var del = document.createElement("button");
        del.classList.add("delete-button");
        del.href = `http://localhost:8080/project/${id}`;
        del.appendChild(document.createTextNode("Delete"));
        del.addEventListener('click', deleteProject);
        form.appendChild(del);

        form.addEventListener("submit", updateProject);

        el.parentNode.replaceChild(form, el);
    })
      .catch(error => {
        console.log(error);
    });
}

function deleteProject(event) {
    event.preventDefault();
    fetch(event.target.href, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) window.location.reload();
            else throw new Error('Uh oh, something went wrong...');
        }).catch(error => {
            console.log(error);
        });
}

function updateProject(event) {
    event.preventDefault();
    var form = event.target;
    fetch(`http://localhost:8080/project/${form.getElementsByTagName("input")[0].value}`, {
            method: 'PUT',
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(response => {
            if (response.ok) window.location.reload();
            else throw new Error('Uh oh, something went wrong...');
        })
            .catch(error => {
            console.log(error);
        });
}

creationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    create();
});

findAll();

