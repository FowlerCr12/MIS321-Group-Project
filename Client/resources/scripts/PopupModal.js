class PopupModal {
    constructor(options = {}) {
        this.title = options.title || 'Message'
        this.type = options.type || 'info' // Choices include info, error, success, warning
        this.modalId = options.modalId || 'popupModal'
        this.createModal()
    }

    createModal() {
        // makes the container that holds the modal. 
        this.modalDiv = document.createElement('div')
        this.modalDiv.className = 'modal fade'
        this.modalDiv.id = this.modalId
        this.modalDiv.setAttribute('aria-labelledby', `${this.modalId}Label`)
        this.modalDiv.setAttribute('aria-hidden', 'true')

        // makes the modal dialog. Confused on this but followed a tutorial.
        const modalDialog = document.createElement('div')
        modalDialog.className = 'modal-dialog'

        // makes the actual content of the modal.
        const modalContent = document.createElement('div')
        modalContent.className = 'modal-content'

        // makes the header of the modal
        const modalHeader = document.createElement('div')
        modalHeader.className = 'modal-header'
        
        const modalTitle = document.createElement('h5')
        modalTitle.className = 'modal-title'
        modalTitle.id = `${this.modalId}Label`
        modalTitle.textContent = this.title

        // Add color class based on type
        let headerClass = '';
        let buttonClass = '';
        
        switch(this.type) { // switches the color of the modal and button based on the type
            case 'error':
                headerClass = 'bg-danger text-white';
                buttonClass = 'btn btn-danger';
                break;
            case 'success':
                headerClass = 'bg-success text-white';
                buttonClass = 'btn btn-success';
                break;
            case 'warning':
                headerClass = 'bg-warning';
                buttonClass = 'btn btn-warning';
                break;
            default:
                headerClass = 'bg-primary text-white';
                buttonClass = 'btn btn-primary';
        }
        
        modalHeader.classList.add(...headerClass.split(' '));
        
        const closeButton = document.createElement('button')
        closeButton.type = 'button'
        closeButton.className = 'btn-close'
        closeButton.setAttribute('data-bs-dismiss', 'modal', 'aria-label', 'Close')
        modalHeader.appendChild(modalTitle)
        modalHeader.appendChild(closeButton)

        // makes the body portion of the modal
        const modalBody = document.createElement('div')
        modalBody.className = 'modal-body'
        modalBody.id = `${this.modalId}Body`

        // makes the footer portion of the modal
        const modalFooter = document.createElement('div')
        modalFooter.className = 'modal-footer'
        
        const okButton = document.createElement('button')
        okButton.type = 'button'
        switch(this.type) { // switches the color of the button based on the type of modal it is set to basically the same thing as the above switch statement but just for the button. 
            case 'error':
                okButton.className = 'btn btn-danger'
                break
            case 'success':
                okButton.className = 'btn btn-success'
                break
            case 'warning':
                okButton.className = 'btn btn-warning'
                break
            default:
                okButton.className = 'btn btn-primary'
        }
        okButton.setAttribute('data-bs-dismiss', 'modal')
        okButton.textContent = 'OK'

        modalFooter.appendChild(okButton)

        //puts the various parts of the modal together into one thing.
        modalContent.appendChild(modalHeader)
        modalContent.appendChild(modalBody)
        modalContent.appendChild(modalFooter)
        modalDialog.appendChild(modalContent)
        this.modalDiv.appendChild(modalDialog)

        document.body.appendChild(this.modalDiv) // finally adds modal to the page
    }

    show(message) { // function for displaying the message.
        const modalBody = document.getElementById(`${this.modalId}Body`) // gets the actual body of each modal
        modalBody.textContent = message
        const modal = new bootstrap.Modal(document.getElementById(this.modalId))
        modal.show()
    }

}
