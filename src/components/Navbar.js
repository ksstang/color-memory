import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

export default function Navbar(props) {
  const {curScore, setIsHighScoreVisible} = props
  return (
    <View style={styles.navBar}>
      <Image style={styles.logo} source={require('../assets/logo.png')} resizeMode='contain' />
      <Text style={styles.score}>Score: {curScore}</Text>
      <Text style={styles.highScore} onPress={() => setIsHighScoreVisible(true)}>High Score</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    padding: 10,
  },
  logo: {
    width: 50,
    height: 50
  },
  score: {

  },
  highScore: {

  },
})
