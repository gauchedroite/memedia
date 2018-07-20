
export interface ILocation {
    id: string
    name: string
    latitude: number
    longitude: number
}

let locations: ILocation[] = []
locations.push({
    id: "caqc0177",
    name: "Gatineau",
    latitude: 45.4765,
    longitude: -75.7013
})
locations.push({
    id: "caqc0312",
    name: "Lévis",
    latitude: 46.7382,
    longitude: -71.2465
})
locations.push({
    id: "caqc0222",
    name: "Jonquière",
    latitude: 48.4236,
    longitude: -71.2395
})


export const getLocation = (id: string) => {
    return locations.find(element => { return element.id == id })
}

export const getNextLocation = (id: string) => {
    for (let ix = 0; ix < locations.length; ix++) {
        if (locations[ix].id == id) {
            return locations[(ix + 1) % locations.length]
        }
    }
    return null;
}
