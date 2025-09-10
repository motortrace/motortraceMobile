import React from 'react'
import Succes from '../components/SuccessPopup'
import {View, Text} from 'react-native'

export default function Success() {
  return (
    <View>
        <Succes visible={true} title={"Congratulations !"} message={"Password Reset successful You’ll be redirected to the login screen now"} />
        <Text> lol </Text>
    </View>
  )
}
