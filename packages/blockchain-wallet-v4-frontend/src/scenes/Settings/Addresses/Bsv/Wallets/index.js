import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, model } from 'data'
import { getData } from './selectors'
import Wallets from './template'
const { WALLET_TX_SEARCH } = model.form

class BsvWalletsContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  onUnarchiveWallet = index => {
    this.props.bsvActions.setAccountArchived(index, false)
  }

  onSendBsv = index => {
    this.props.modalActions.showModal(model.components.sendBsv.MODAL, { index })
  }

  onSwapBsv = account => {}

  render () {
    const { data, search } = this.props

    return data.cata({
      Success: value => {
        return (
          <Wallets
            search={search && search.toLowerCase()}
            data={value}
            onUnarchiveWallet={this.onUnarchiveWallet}
            onSendBsv={this.onSendBsv}
            onSwapBsv={this.onSwapBsv}
          />
        )
      },
      Failure: () => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  search: formValueSelector(WALLET_TX_SEARCH)(state, 'search')
})

const mapDispatchToProps = dispatch => ({
  bsvActions: bindActionCreators(actions.core.kvStore.bsv, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BsvWalletsContainer)
