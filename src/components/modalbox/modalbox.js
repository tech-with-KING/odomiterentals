import React, { Component } from 'react';
class Modal extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() { 
        return (  
            <>
                     <button id="myBtn">Open Modal</button>


<div id="myModal" class="modal">

  <div class="modal-content">
    <span class="close">&times;</span>
    <p>Some text in the Modal..</p>
  </div>

</div>
            </>
        );
    }
}
 
export default Modal;