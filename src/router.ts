import { MyComponent } from "./MyComponent";

interface Route {
    path: string;
    component: typeof MyComponent;
}

class Router {
    constructor(dom: HTMLElement, route: Route[]) {
        this.dom = dom
        this.route = route;
        this.registerPath()
        this.init()
    }

    matchRoute?: {
        route: Route;
        path: string
        component?: MyComponent
    };
    oldRoute?: {
        route: Route;
        path: string
        component?: MyComponent

    };

    route: Route[];

    routeMap: Record<string, Route> = {};

    dom: HTMLElement;

    registerPath() {
        this.route.forEach(item => {
            this.routeMap[item.path] = item;
        })
    }

    init() {
        this.matchPath()
        window.addEventListener('hashchange', () => {
            this.matchPath()
        })
    }
    

    matchPath() {
        const hash = (location.hash || '').slice(1)

        console.log(hash, this.routeMap)
        const route = this.routeMap[hash];
        this.oldRoute = this.matchRoute && {
            ...this.matchRoute,    
        }
        this.matchRoute = {
            path: hash,
            route
        }

        this.render()
    }

    render() {
        if (this.oldRoute?.component) {
            this.oldRoute?.component.destroy()
        }
        this.dom.innerHTML = '';
        if (this.matchRoute?.route) {
            const component =  new this.matchRoute.route.component(this.dom)
            component.render()
            this.matchRoute.component = component;
        }
    }
}

export default Router