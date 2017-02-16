import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  SegmentedControlIOS,
  TextInput,
  ListView,
  TouchableHighlight,
} from 'react-native';

class Home extends Component {

  constructor(props) {
    super(props);
    this.data = [];
    this.nextTodoId = 0;
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows(this.data)
    };
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: 22}}>
        <SegmentedControlIOS
          style={styles.segment}
          values={['All', 'Incomplete', 'Completed']}
          selectedIndex={0}
          onChange={this.segmentOnChange}
        />
        <TextInput
          ref={0}
          style={styles.textInput}
          placeholder="new task?"
          onSubmitEditing={this.textInputOnSubmit}
          returnKeyType="done"
        />
        <View
          style={styles.separator}
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          enableEmptySections={true}
        />
      </View>
    )
  }

  textInputOnSubmit = (event) => {
    const userInput = event.nativeEvent.text;
    const dic = {
      id: this.nextTodoId++,
      task: userInput,
      isDone: false
    };
    // update datasource
    this.data = this.data.concat([dic]);
    this.updateRow();

    // clear textinput
    this.refs[0].clear();
  }

  segmentOnChange = (event) => {
    this.segmentIdx = event.nativeEvent.selectedSegmentIndex;
    this.updateRow();
  }

  updateRow = () => {
    const segmentIdx = this.segmentIdx;
    const filteredData = this.data.filter((item) => {
      if (segmentIdx == 1) {
        return item.isDone == false
      } else if (segmentIdx == 2) {
        return item.isDone == true
      } else {
        return true;
      }
    });

    this.setState({
      dataSource: this.ds.cloneWithRows(filteredData)
    });
  }

  _renderRow = (rowData, sectionID, rowID, highlightRow) => {
    return (
      <TouchableHighlight
        underlayColor='#CCCCCC'
        onPress={() => {
          this._rowOnPress(rowData.id);
          highlightRow(sectionID, rowID);
        }}
      >
        <View style={styles.cell}>
          <Text style={styles.isDone}>{rowData.isDone ? `✅ `: `⭕️ `}</Text>
          <Text style={styles.task}>{rowData.task}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={styles.separator}
      />
    );
  }

  _rowOnPress = (rowID) => {
    this.data = this.data.map((item) => rowID == item.id ? {id: item.id, task: item.task, isDone: !item.isDone} : item);
    this.updateRow();
  }
}

const styles = StyleSheet.create({
  // segment
  segment: {
    margin: 10
  },
  // text input
  textInput: {
    marginLeft: 10,
    marginRight: 10,
    height: 40
  },
  // cell
  cell: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    padding: 10,
  },
  isDone: {
    fontSize: 20,
  },
  task: {
    fontSize: 20,
    flex: 1,
  },
  // separator
  separator: {
    marginLeft: 10,
    marginRight: 10,
    height: 1,
    backgroundColor: '#CCCCCC'
  }
});

module.exports = Home;
