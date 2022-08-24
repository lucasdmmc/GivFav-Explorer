import { GithubUser } from "./githubuser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }
  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists){
        throw new Error(`O usuário já existe`)
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined){
        throw new Error("Usuário não encontrado!")
      }
      
      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    }catch(error){
      alert(error.message)
    }
  }

  delete(user){
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)
    this.entries = filteredEntries

    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector("tbody")
    this.update()
    this.addButton()
  }

  addButton() {
    const addButton = this.root.querySelector(".favoritar")

    addButton.addEventListener("click", () => {
      const { value } = this.root.querySelector("input")
        this.add(value)
      }
    )
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector(".user img").src = `https://github.com/${user.login}.png`
      row.querySelector(".user img").alt = `Imagem de ${user.login}`
      row.querySelector(".user a").href = `https:github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name
      row.querySelector(".user span").textContent = user.login
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers
      row.querySelector("button").addEventListener("click", () => {
        const isDeleted = confirm(`Tem certeza que deseja deletar o usuário ${user.name}?`)
        if(isDeleted){
          this.delete(user)
        }
      })
      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement("tr")

    tr.innerHTML = `
    <td class="user">
    <img src="https://github.com/lucasdmmc.png" alt="">
    <a href="https://github.com/lucasdmmc" target="_blank">
      <p>Lucas Carvalho</p>
      <span>lucasdmmc</span>
    </a>
    </td>
    <td class="repositories">123</td>
    <td class="followers">1234</td>
    <td>
      <button>Remover</button>
    </td>
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach(tr => {
      tr.remove()
    })

    const tbody = this.root.querySelector(".table-border tbody")
    if(this.entries.length === 0) {
      tbody.classList.add("clean")
    } else {
      tbody.classList.remove("clean")
    }
    console.log(tbody)
  }
}