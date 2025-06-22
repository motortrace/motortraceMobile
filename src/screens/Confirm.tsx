import React from 'react'
import ConfirmationPopup from '../components/ConfirmationPopup'
import {View, Text} from 'react-native'

export default function Confirm() {
  return (
    <View>
        <ConfirmationPopup
            visible={true}
            title="Delete Account"
            message="Are you sure you want to delete your account? This action is permanent and cannot be undone."
            iconType='info'
        />
        <Text> lol </Text>
    </View>
  )
}
