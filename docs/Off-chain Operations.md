# Off-Chain Operations

smart node extension:
- keeper for distributeFees()
- arb bot for DP<->LPs
- validator manager
  - creation
    - create validator
    - send withdrawal message
    - apply for reimbursement
  - exit
    - submit exit message

admin server:
- monitor network status
  - alert when admin eyeballs/action required
- verify new minipool validity
  - receive, validate, and store pre-signed withdrawal message in encrypted form
  - sign a message to the chain attesting validity
- retrieve pre-signed exit message as appropriate
- query NO database to determine 

website:
- javascript interface/backend
- very simple reference frontend
- landing page