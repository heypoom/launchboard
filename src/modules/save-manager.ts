import {applySnapshot, getSnapshot} from 'mobx-state-tree'

import {BoardModel, BoardState} from '../store/board'

const CONFIG_KEY = 'launchboard.config'

export function save(board: BoardModel) {
  const saveString = JSON.stringify(getSnapshot(board))
  localStorage.setItem(CONFIG_KEY, saveString)

  return saveString
}

export function load(board: BoardModel) {
  const saveString = localStorage.getItem(CONFIG_KEY)
  if (!saveString) return

  const snapshot = JSON.parse(saveString) as BoardState
  loadFromSnapshot(snapshot, board)
}

export async function loadRemote(url: string, board: BoardModel) {
  const res = await fetch(url)
  const snapshot: BoardState = await res.json()
  loadFromSnapshot(snapshot, board)
}

export function loadFromSnapshot(snapshot: BoardState, board: BoardModel) {
  applySnapshot(board, snapshot)

  board.sounds.forEach(s => board.addSound(s.name, s.src))
  board.slots.forEach(s => board.setupSlot(s.slot))
}
