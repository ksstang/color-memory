import { orderBy, take } from 'lodash'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import ReactNativeModal from 'react-native-modal'
import { getScores } from '../services/HighScoreDb'

export default function HighScore(props) {
  const {isHighScoreVisible, setIsHighScoreVisible} = props

  const closeHighScore = () => {
    setIsHighScoreVisible(false)
  }

  const [scores, setScores] = useState([])

  const getLatestHighScores = async () => {
    let allScores = await getScores()
    allScores = take(allScores, 10)
    setScores(allScores)
  }

  useEffect(() => {
    getLatestHighScores()
  }, [isHighScoreVisible])

  return (
    <View>
      <ReactNativeModal isVisible={isHighScoreVisible} onBackdropPress={closeHighScore}>
        <View style={styles.highScoreContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Top 10 Scores</Text>
            <Text style={styles.close} onPress={closeHighScore}>Close</Text>
          </View>
          <ScrollView style={styles.body}>
            {
              scores.length > 0 
              ?
              <View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.rank}>Rank</Text>
                  <Text style={styles.name}>Name</Text>
                  <Text style={styles.score}>Score</Text>
                </View>
                {
                  scores.map((score, index) => {
                    return (
                      <View key={index} style={styles.scoreContainer}>
                        <Text style={styles.rank}>#{index + 1}</Text>
                        <Text style={styles.name}>{score.name}</Text>
                        <Text style={styles.score}>{score.score}</Text>
                      </View>
                    )
                  })
                }
              </View>
              :
              <View style={styles.centerMessage}>
                <Text>No scores yet. Finish the game first!</Text>
              </View>
            }
          </ScrollView>
        </View>
      </ReactNativeModal>
    </View>
  )
}

const styles = StyleSheet.create({
  highScoreContainer: {
    padding: 10,
    width: '100%',
    height: '80%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 5,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  close: {

  },
  body: {
    flexGrow: 1,
    width: '100%',
  },
  scoreContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    flex: 1,
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 5
  },
  name: {
    flex: 3,
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 5
  },
  score: {
    flex: 1,
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 5
  },
  centerMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
})
