import { findIndex, orderBy } from "lodash"

const { default: AsyncStorage } = require("@react-native-async-storage/async-storage")

export const storeScores = async (scores) => {
  try {
    await AsyncStorage.setItem('@score', JSON.stringify(scores))
  } catch (e) {

  }
}

export const getScores = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@score')
    let sorted = jsonValue != null ? JSON.parse(jsonValue) : []
    sorted = orderBy(sorted, ['score', 'name'], ['desc', 'asc'])
    return sorted
  } catch (e) {

  }
}

export const addNewScoreToDb = async (newScore) => {
  let curScores = await getScores()
  let newId = curScores.length + 1
  await storeScores([
    ...curScores,
    {
      ...newScore,
      ...{id: newId}
    }
  ])
  return newId
}

export const getRankByRecordId = async (id) => {
  let curScores = await getScores();
  let index = findIndex(curScores, (s) => {return s.id === id})
  return index + 1
}