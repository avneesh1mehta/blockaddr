import React from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';

// Add this line when ready to create QR Reader
// import { BarCodeScanner, Permissions } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addr: '',
      checked: false,
      valid: false,
      balance: 0.0,
      sent: 0.0,
      received: 0.0,
    }
  }

  handleTextChange = (value) => {
    const addr = value;
    this.setState(() => ({
      addr,
    }));
  }

  handleSubmitButtonPress = () => {
    fetch('https://blockexplorer.com/api/addr-validate/' + this.state.addr)
    .then(results => {return results.json();})
    .then(data => {
      this.setState(() => ({valid: data}));
      // console.log("Valid: " + this.state.valid);
      if (this.state.valid) {
        this.setState(() => ({checked: true}));
        fetch('https://blockexplorer.com/api/addr/' + this.state.addr + '/balance')
        .then(results => {return results.json();})
        .then(data => {
          // console.log(data);
          this.setState(() => ({
            balance: data
          }));
        });
        fetch('https://blockexplorer.com/api/addr/' + this.state.addr + '/totalSent')
        .then(results => {return results.json();})
        .then(data => {
          // console.log(data);
          this.setState(() => ({
            sent: data
          }));
        });
        fetch('https://blockexplorer.com/api/addr/' + this.state.addr + '/totalReceived')
        .then(results => {return results.json();})
        .then(data => {
          // console.log(data);
          this.setState(() => ({
            received: data
          }));
        });
      }
    });
  }


  handleBalance = (bal) => {
    if (this.state.valid) {
      return("Balance: "  + (bal / 100000000.0) + " BTC")
    }
    if (this.state.checked == true){
      return("Invalid Address")
    }
  }

  handleSent = (sent) => {
    if (this.state.valid) {
      return("Sent: " + (sent / 100000000.0) + " BTC")
    }
  }

  handleReceived = (received) => {
    if (this.state.valid) {
      return("Received: " + (received / 100000000.0) + " BTC")
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your public Bitcoin address here!"
          onChangeText={this.handleTextChange}
        />
        <Button
          title="Check Address"
          onPress={this.handleSubmitButtonPress}
        />
        <Text>{this.handleBalance(this.state.balance)}</Text>
        <Text>{this.handleSent(this.state.sent)}</Text>
        <Text>{this.handleReceived(this.state.received)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
