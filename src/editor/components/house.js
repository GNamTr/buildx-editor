import { makePiece } from "./index"
import { removeDescendants } from "../utils"

const _add = (parent, thicknessMM, color) => side => {

  const scaledPoints = side.pts.map(([x,y]) => ([x/1000.0, y/1000.0]))
  const scaledPos = {
    x: side.pos.x/1000.0,
    y: side.pos.y/1000.0,
    z: side.pos.z/1000.0
  }

  const piece = makePiece(scaledPoints, thicknessMM/1000.0, color)

  piece.position.copy(scaledPos)
  piece.rotation.x = side.rot.x
  piece.rotation.y = side.rot.y
  piece.rotation.z = side.rot.z
  piece.rotation.order = side.rot.order
  const geom = new THREE.EdgesGeometry(piece.geometry)
  const lines = new THREE.LineSegments(geom, new THREE.LineBasicMaterial( { color: '#ad9f83', overdraw: 0.5 }))

  // const xArrow = new THREE.ArrowHelper( new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 3, 'red')
  // piece.add(xArrow)
  // const yArrow = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 3, 'green')
  // piece.add(yArrow)
  // const zArrow = new THREE.ArrowHelper( new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 3, 'blue')
  // piece.add(zArrow)

  piece.add(lines)
  parent.add(piece)
}

const House = pieces => {
  const house = new THREE.Object3D()
  const addBayPiece = _add(house, 18, 0x00FF00)
  const addFramePiece = _add(house, 250, 0x00CC00)

  const draw = pieces => {
    const positions = ['inner', 'outer']
    for (const bay of pieces.bays) {
      for (const position of positions) {
        bay.sides[position].leftWall.map( addBayPiece )
        bay.sides[position].rightWall.map( addBayPiece )
        bay.sides[position].floor.map( addBayPiece )
        bay.sides[position].leftRoof.map( addBayPiece )
        bay.sides[position].rightRoof.map( addBayPiece )
      }
    }
    for (const frame of pieces.frames) {
      frame.fins[0].map( addFramePiece )
    }
  }

  const update = pieces => {
    removeDescendants(house)
    draw(pieces)
  }

  update(pieces)

  return {
    output: house,
    update
  }
}

module.exports = House
