import { StatusBar } from 'expo-status-bar';
import { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Image, View, Pressable, Text } from 'react-native';

const physics = {
  acceleration: 0.1,
  velocity: 3
}
var sec = 0;
const genPillar = () => {
  let rand = Math.random() * 10 % 3;
  let top = (innerHeight/4) * rand;
  const pillar = {
    x: innerWidth/2,
    top: {
      height: top,
      y: -(innerHeight/2)
    },
    bot: {
      height: (3 - rand) * (innerHeight/4),
      y: -(innerHeight/2) + top + 200
    }
  }
  return pillar;
}
const pillars = [];
pillars.push(genPillar());

export default function App() {
  const [positon, setPostion] = useState({x: 0, y: 0});
  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  if(positon.y > innerHeight/2 && alive) {
    setAlive(false);
  }

  const onTap = () => {
    console.log('Tapped');
    physics.velocity = -3;
    physics.acceleration = 0;
    const jump = setInterval(() => {
      physics.velocity = 3;
      physics.acceleration = 0.1;
      clearInterval(jump);
    }, 500);
    
  }

  if(pillars[0].x < -innerWidth) {
    pillars.shift();
  }

  useEffect(() => {
    if(sec === 200) {
      pillars.push(genPillar());
      sec = 0;
    }
    const gameInterval = setInterval(() => {
      physics.velocity += physics.acceleration;
      sec++;
      console.log(sec);
      setPostion({x: 0, y: positon.y + physics.velocity});
    }, 1000/60);
    
    if (paused || !alive) {
      clearInterval(gameInterval);
      //clearInterval(pillarInterval);
    }

    return () => {
      //clearInterval(pillarInterval);
      clearInterval(gameInterval);
    }
  });
  
  return (
    <Pressable style={styles.container} onPress={onTap}>
      <Image source={require('./assets/Clara_1.png')} style={{width: 50, height: 50, top: positon.y, left: positon.x}}></Image>
      {pillars.map((pillar, index) => {
        pillar.x--;
        return (
          <View key={index}>
            <View style={{width: 50, height: pillar.top.height, backgroundColor: 'green', position: 'absolute', top: pillar.top.y, left: pillar.x}}></View>
            <View style={{width: 50, height: pillar.bot.height, backgroundColor: 'green', position: 'absolute', top: pillar.bot.y, left: pillar.x}}></View>
          </View>
        );
      })}
    </Pressable>    
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
