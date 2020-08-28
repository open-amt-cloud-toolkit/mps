import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './styles/dropdown.scss'

class Dropdown extends React.Component {
    constructor() {
        super();

        this.state = {
            showMenu: false,
            selectedItem: ''
        }
    }

    showMenu = (event) => {
        event.preventDefault();
        this.setState({
            showMenu: true
        }, () => {
            document.addEventListener('click', this.closeMenu)
        })
    }

    closeMenu = (event) => {
        if (this.dropdownMenu && !this.dropdownMenu.contains(event.target)) {
            this.setState({
                showMenu: false
            }, () => {
                document.removeEventListener('click', this.closeMenu)
            })
        }
    }

    handleSelected = (item) => {
        const { handleSelectedItem } = this.props;
        handleSelectedItem(item)
        this.setState({ selectedItem: item.label })
    }

    render() {
        const { options } = this.props;

        return (
            <div className="dropdown-container" >
                <button onClick={this.showMenu} className="menuicon">
                    <FontAwesomeIcon icon='ellipsis-h' size='2x' color='#ccc' title={'click for more options'} />
                </button>
                {!this.state.showMenu && <div style={{ fontSize: '10px' }}>more actions</div>}
                {this.state.showMenu ?
                    (<div className='menu' id="scroll" ref={(element) => { this.dropdownMenu = element }}>
                        {options.map(item => <div className={"items-list " + (item.label === this.state.selectedItem ? "isSelectedItem" : '')} key={item.label} title={item.label} value={item.label} onClick={() => this.handleSelected(item)}>{item.label}</div>)
                        }
                    </div>) : null
                }
            </div>
        )
    }
}

export default Dropdown;