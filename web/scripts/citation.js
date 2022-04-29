const projectDropdown = document.getElementById("project-dropdown");
const projectForm = document.getElementById("project-choice")
const creationForm = document.getElementById("citation-creation")
const boxList = document.getElementById("box-list");

function toggleFormCreation() {
    var form = document.getElementById("citation-creation");
    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

function findAllByProject() {
    fetch(`http://localhost:8080/citation/project/${projectDropdown.value}`, {
            method: 'GET'
        }).then(response => {
            if (response.ok) return response.json();
            else throw new Error('Uh oh, something went wrong...');
        })
          .then(citations => {
            boxList.innerHTML = "";
            boxList.appendChild(creationForm);
            creationForm.addEventListener("submit", save);
            creationForm.style.display = "block";
            for (var i = 0; i < citations.length; i++) {
                createBox(citations[i]);
            }
        })
          .catch(error => {
            console.log(error);
        });
}

function save(event) {
    event.preventDefault();
    fetch(`http://localhost:8080/citation/${projectDropdown.value}`, {
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

function findAll() {
    fetch('http://localhost:8080/citation', {
            method: 'GET'
        }).then(response => {
            if (response.ok) return response.json();
            else throw new Error('Uh oh, something went wrong...');
        })
          .then(citations => {
            for (var i = 0; i < citations.length; i++) {
                createBox(citations[i]);
            }
        })
          .catch(error => {
            console.log(error);
        });
}

function createBox(c) {
    var title = document.createElement("h5");
    title.appendChild(document.createTextNode(c.title))
    var cite = document.createElement("p");
    cite.appendChild(document.createTextNode(c.citation));
    cite.classList.add("desc");
    var abstrac = document.createElement("p");
    abstrac.appendChild(document.createTextNode(c.abstrac));
    abstrac.classList.add("desc");

    var citation = document.createElement("a");
    citation.classList.add("box");
    citation.classList.add("citation-box")
    citation.appendChild(title);
    citation.appendChild(cite);
    citation.appendChild(abstrac);
    citation.appendChild(createFormInput("hidden", "id", c.id))
    citation.href = ""

    if (c.hasProject == true) {
        citation.classList.add("has-project");
    }

    citation.addEventListener('click', makeForm);
    var el = document.getElementById("box-list");
    el.appendChild(citation);
}

function makeForm(event) {
    event.preventDefault();
    var el = event.target;
    if (projectDropdown.value !== "all") {
        el.classList.add("box-form");
        var button = document.createElement("button");
        button.appendChild(document.createTextNode("Remove from Project"));
        button.classList.add("delete-button");
        button.href = `http://localhost:8080/project/${projectDropdown.value}/citation/${el.getElementsByTagName("input")[0].value}`;
        button.addEventListener("click", deleteFromProject);
        el.appendChild(button);
    }
}

function deleteFromProject(event) {
    event.preventDefault();
    fetch(event.target.href, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                var parent = event.target.parentNode;
                parent.parentNode.removeChild(parent);
            } else throw new Error('Uh oh, something went wrong...');
        }).catch(error => {
            console.log(error);
        });
}

function findProjects() {
    fetch('http://localhost:8080/project', {
            method: 'GET'
        }).then(response => {
            if (response.ok) return response.json();
            else throw new Error('Uh oh, something went wrong...');
        })
          .then(projects => {
            for (var i = 0; i < projects.length; i++) {
                option = document.createElement("option");
                option.value = projects[i].id;
                option.appendChild(document.createTextNode(projects[i].title));
                projectDropdown.appendChild(option);
            }
        })
          .catch(error => {
            console.log(error);
        });
}

findAll();
findProjects();

projectForm.addEventListener("submit", function(event) {
    event.preventDefault();
    if (projectDropdown.value === "all") window.location.reload();
    findAllByProject();
})