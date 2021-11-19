/** @typedef {{ path: string, title: string, meta: object }} Item */

/** @type {Item[]} */
const index = [
    { path: 'index.html', title: 'Main', meta: {} },
    { path: 'projects/project-1.html', title: 'Project 1', meta: { status: 'completed' } },
    { path: 'projects/project-2.html', title: 'Project 2', meta: { status: 'canceled' } },
    { path: 'projects/project-3.html', title: 'Project 3', meta: { status: 'ongoing' } },
];

/**
 * @template T
 * @param {T} item
 * @param {(val: T) => void} fn
 * @return {T}
*/
function apply(item, fn) {
    fn(item);
    return item;
}

function containsAll(source, items) {
    return Object.entries(items)
        .every(([key, value]) => source[key] === value);
}

/** @returns {Item[]} */
function executeQuery(index, { root = '', query }) {
    const queryProps = !query ? {} : Object.fromEntries(
        query.split('&').map(prop => prop.split('='))
    );

    return index
        .filter(item => item.path.startsWith(root))
        .filter(item => containsAll(item.meta, queryProps));
}

class View extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const type = this.getAttribute('type');
        const root = this.getAttribute('root');
        const query = this.getAttribute('query');

        const items = executeQuery(index, { root, query });

        this.appendChild(
            apply(document.createElement('ul'), list => {
                const createListItem = ( /** @type {Item} */ item) =>
                    apply(document.createElement('li'), listItem => {
                        listItem.appendChild(
                            apply(document.createElement('a'), link => {
                                link.href = item.path;
                                link.innerHTML = item.title;
                            })
                        );
                    });

                for (const item of items) {
                    list.appendChild(createListItem(item));
                }
            })
        );
    }
}

customElements.define('data-view', View);