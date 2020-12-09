import { each, find, findIndex, indexOf, shuffle } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ReactNativeModal from 'react-native-modal';
import { addNewScoreToDb, getRankByRecordId, getScores } from '../services/HighScoreDb';

export default function GameBroad(props) {

  const {changeScore, resetScore, curScore} = props;

  const COLORS = ['#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#8e7cc3', '#c27ba0']

  const [cards, setCards] = useState([])
  
  const [selected, setSelected] = useState([])
  const [matched, setMatched] = useState([])

  const [gameEndModalVisible, setGameEndModalVisible] = useState(false)
  const [name, setName] = useState('')

  const initCards = () => {
    let cardArr = [];
    each(COLORS, (color, index) => {
      cardArr.push({id: index, color: color});
      cardArr.push({id: index + COLORS.length, color: color})
    })
    cardArr = shuffle(cardArr)
    setCards(cardArr)

    // reset matched
    setMatched([])

    // reset name
    setName('')

    // close modal
    setGameEndModalVisible(false)
  }

  const checkCanCardBeClicked = (card) => {
    if (checkIfMatched(card)) return false
    if (checkIfSelected(card)) return false
    return selected.length < 2
  }

  const getCusCardStyle = (card) => {
    if (checkIfMatched(card)) {
      return {
        backgroundColor: 'white',
        borderWidth: 0
      }
    }
    if (checkIfSelected(card)) {
      return {
        backgroundColor: card.color,
        borderWidth: 2
      }
    }
    return {
      backgroundColor: 'grey',
      borderWidth: 2
    }
  }

  const onCardClick = (index) => {
    if (selected.length >= 2) {
      return
    }
    // alert(index + cards[index].color)
    setSelected([
      ...selected,
      cards[index]
    ])
  }

  const checkIfSelected = (card) => {
    return selected.indexOf(card) !== -1
  }

  const checkSelected = () => {
    if (selected.length < 2) {
      return
    }
    if (selected.length === 0) {
      return
    }
    if (selected[0].color === selected[1].color) {
      // matched!!
      changeScore(5)
      setMatched([
        ...matched,
        selected[0],
        selected[1]
      ])
      setSelected([])
    } else {
      // not matched...
      changeScore(-1)
      setSelected([])
    }
  }

  useEffect(() => {
    setTimeout(() => {
      checkSelected()
    }, 1000)
  }, [selected])

  const checkIfMatched = (card) => {
    return matched.indexOf(card) !== -1
  }

  const checkMatched = () => {
    if (cards.length === 0) return
    if (matched.length === cards.length) {
      // game end!
      setGameEndModalVisible(true)
    }
  }

  useEffect(() => {
    checkMatched()
  }, [matched])

  const submitScore = async (name) => {
    // check name input
    if (!name) {
      alert('Please enter your name')
      return;
    }

    // add to high score
    let scoreRecord = {
      name: name,
      score: curScore
    }
    let newRecordId = await addNewScoreToDb(scoreRecord)

    // Check rank
    let newRank = await getRankByRecordId(newRecordId)
    Alert.alert('', `You are ranked at #${newRank}!`)

    // reset grid
    initCards()
    // reset score
    resetScore()
  }

  // Init
  useEffect(() => {
    initCards()
  }, [])

  return (
    <View style={styles.gameBroad}>
      <Text style={styles.welcomeText}>Welcome to Color Memory!</Text>
      <Text style={styles.ruleText}>Flip cards to find matching colors!</Text>
      {/* <Text style={styles.ruleText} onPress={() => setGameEndModalVisible(true)}>Debug score</Text> */}
      <View style={styles.cardContainer}>
        {
          cards.map((card, index) => {
            return (
              <View 
                key={index} 
                style={styles.cardWrapper}>
                <TouchableOpacity 
                  style={{
                    ...styles.card, 
                    ...getCusCardStyle(card)
                  }}
                  onPress={() => onCardClick(index)}
                  disabled={!checkCanCardBeClicked(card)}>
                  {/* <Text>{card.color}</Text> */}
                </TouchableOpacity>
              </View>
            )
          })
        }
      </View>
      <ReactNativeModal 
        isVisible={gameEndModalVisible}
        supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.gameEndModalContainer}>
          <Text style={styles.gameEndTitle}>Congratulations! You won!</Text>
          <Text style={styles.gameEndMessage}>Score: {curScore}</Text>
          <TextInput 
            style={styles.gameEndNameInput} 
            value={name} 
            placeholder="Input your name"
            onChangeText={text => setName(text)} />
          <Button title="Submit Score" onPress={() => submitScore(name)} />
        </View>
      </ReactNativeModal>
    </View>
  )
}

const styles = StyleSheet.create({
  gameBroad: {
    flexGrow: 1,
    alignItems: 'center'
  },
  welcomeText: {
    margin: 5,
    fontSize: 20,
    fontWeight: 'bold'
  },
  ruleText: {

  },
  cardContainer: {
    flex: 1,
    margin: 10,
    display: 'flex',
    width: '80%',
    height: '70%',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  cardWrapper: {
    padding: 5,
    width: '25%',
    height: '25%',
  },
  card: {
    flex: 1,
    borderRadius: 5,
    borderColor: 'black',
  },
  gameEndModalContainer: {
    padding: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 5,
  },
  gameEndTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5
  },
  gameEndMessage: {

  },
  gameEndNameInput: {
    borderColor: 'grey',
    borderBottomWidth: 1,
    width: '100%',
    padding: 10,
    margin: 10
  },
  gameEndButton: {

  }
})
