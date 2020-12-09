/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Navbar from './components/Navbar';
import GameBroad from './scenes/GameBroad';
import HighScore from './scenes/HighScore';

const App: () => React$Node = () => {

  const [curScore, setCurScore] = useState(0)
  const [isHighScoreVisible, setIsHighScoreVisible] = useState(false)

  const changeScore = (delta) => {
    setCurScore(curScore + delta)
  }

  const resetScore = () => {
    setCurScore(0)
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.viewContainer}>
        <Navbar curScore={curScore} setIsHighScoreVisible={setIsHighScoreVisible} />
        <GameBroad changeScore={changeScore} resetScore={resetScore} curScore={curScore} />
        <HighScore isHighScoreVisible={isHighScoreVisible} setIsHighScoreVisible={setIsHighScoreVisible} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'white'
  }
});

export default App;
