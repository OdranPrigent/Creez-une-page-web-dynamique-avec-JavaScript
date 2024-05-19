let projets;
let categories = [];

function filtre(id){
    createGalery (projets, id);
}

function main () {
    fetch("http://localhost:5678/api/works")
    .then ((reponse) => reponse.json())
    .then ((reponse) => {createGalery(reponse, 0)})
    .catch ((error) => {console.log(error)})
}

function createGalery (works, id) {
    projets = works;
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    let filtres = document.querySelector(".filtres");
    filtres.innerHTML = "";
    for (let i =0; i<works.length; i++){
        let figure = document.createElement("figure");
        figure.setAttribute("categorie", works[i].categoryId);
        let image = document.createElement("img");
        image.src = works[i].imageUrl;
        image.alt = works[i].title;
        let j =0;
        
        for (j=0; j<categories.length; j++)
            if (categories[j] == works[i].category.name)
                j = categories.length+1;
        if (j == categories.length)
            categories.push(works[i].category.name);

        let figCaption = document.createElement("figcaption");
        figCaption.innerHTML = works[i].title;

        if (id == 0 || works[i].categoryId == id){
            figure.appendChild(image);
            figure.appendChild(figCaption);
            gallery.innerHTML += figure.outerHTML;
        } 
    }
    createFiltre(-1);
    for (let j =0; j<categories.length; j++)
        createFiltre(j);
    
}

function createFiltre(j){
    let filtres = document.querySelector(".filtres");
    if (j == -1)
        filtres.innerHTML += '<p class="filtre" onclick="filtre(' +0+ ')">Tous</p>';
    else 
        filtres.innerHTML += '<p class="filtre" onclick="filtre(' +(j+1)+ ')">' + categories[j] + '</p>';
}

main()