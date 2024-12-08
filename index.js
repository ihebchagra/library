function defineComponent(name, template, styles) {
    customElements.define(
        name,
        class extends HTMLElement {
            connectedCallback() {
                const root = this.attachShadow({ mode: "closed" });
                root.innerHTML = `<style>${styles}</style>${template}`;
                Alpine.initTree(root);

            }
        }
    );
}

function libraryData() {
    return {
        books: [],
        searchQuery: '',
        get filteredBooks() {
            if (!this.searchQuery) {
                return this.books;
            }
            const normalizedQuery = this.normalizeString(this.searchQuery);
            return this.books.filter(book =>
                this.normalizeString(book.title).includes(normalizedQuery) ||
                book.links.some(link => this.normalizeString(link.name).includes(normalizedQuery))
            );
        },
        toTitleCase(str) {
            return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        },
        normalizeString(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        },
        init() {
            fetch('library.json')
                .then(response => response.json())
                .then(data => {
                    this.books = data.map(book => ({
                        ...book,
                        title: this.toTitleCase(book.title)
                    }));
                })
                .catch(error => console.error('Error fetching the library data:', error));
        }
    }
}


defineComponent(
    "site-footer",
    /*html*/`
    <footer class="footer">
            <div class="footer-content">
                <p class="copyright">© 2024 Hazem al Abed et Iheb Chagra.</p>
                <p class="license">Licence GNU General Public License v3.0</p>
                <p>Ce site est Open-Source sur <a href="https://github.com/ihebchagra/library">Github</a></p>
                <div class="contact-info">
                    <p> Contactez-nous:</p>
                    <p> Hazem Al Abed: <a href="mailto:hazem.abed@etudiant-fmt.utm.tn">hazem.abed@etudiant-fmt.utm.tn</a></p>
                    <p>Médecin Interne, Hôpitaux de Tunis</p>              

                    <p> Iheb Chagra: <a href="mailto:ihebchagra@gmail.com">ihebchagra@gmail.com</a></p>
                    <p>Médecin Résident en Microbiologie, Hôpitaux de Tunisie</p>              
                </div>
            </div>
        </footer>`,
    /*css*/`
    .footer {
        font-family: 'EB Garamond', ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        margin-top: 1rem;
        padding: 2rem 0;
        background-color: #F3F4F6;
        border-top: 1px solid #E5E7EB;
    }
    
    .footer-content {
        max-width: 65ch;
        margin: 0 auto;
        text-align: center;
    }
    
    .footer p {
        margin: 0.5rem 0;
        font-size: 0.875rem;
        color: #4B5563;
    }
    
    .footer a {
        color: #000;
        text-decoration: none;
    }
    
    .footer a:hover {
        text-decoration: underline;
    }
    
    .copyright {
        font-weight: bold;
    }
    
    .contact-info {
        margin-top: 1rem;
    }
    `
);
