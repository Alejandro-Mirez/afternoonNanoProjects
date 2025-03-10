document.getElementById("btn").addEventListener("click", generate)
let content;

const textarea = document.getElementById("txt")
textarea.addEventListener("input", ev => content = ev.target.value)

function generate(ev){
    ev.preventDefault()
    const textEncoder = new TextEncoder();
    const uint8Array = textEncoder.encode(content);
    const length = uint8Array.length
    let ab = new ArrayBuffer(length)
    let dv = new DataView(ab)
    for (let i=0; i<length; i++){
        dv.setInt8(i, uint8Array[i])
    }

    let file = new File([ab], "yourFile.txt", {type: "text/plain"});

    let url = URL.createObjectURL(file)
    a = document.createElement("a")
    a.href = url
    a.download = file.name
    a.textContent = `Download ${file.name}`
    document.getElementById("link").append(a)

}
