
interface IRoute {
    url: string
    callback: (param?: string) => void
}

export const addRoute = (url: string, callback?: (param?: string) => void) => {
    router.push(<IRoute>{ url, callback });
};

const hashChange = () => {
    const hash = window.location.hash;
    const route = router.filter(one => hash.match(new RegExp(one.url)))[0];
    if (route) {
        if (route.callback) {
            let params = new RegExp(route.url).exec(hash);
            route.callback(params[1]);
        }
    }
};

let router: IRoute[] = [];

window.addEventListener('hashchange', hashChange);
window.addEventListener('DOMContentLoaded', hashChange);
