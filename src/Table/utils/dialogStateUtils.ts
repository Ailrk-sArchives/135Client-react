/*
 * Dialog can be classified in two types: Confirm Dialog and Submit Dialogue.
 * Each type of dialog requires different parameters, different shown state to
 * control their visibility, and serves different purpose.
 *
 * ShownDialogProps interface contains all states and data a component need to
 * invoke different type of dialogs.
 * */
import React from 'react';

// all dialogues has confirmed.
export interface DialogConfirmedProps {
  confirmed: React.MutableRefObject<boolean>,
  breakSig?: React.MutableRefObject<boolean>,
}

// need when a component need one dialog.
export interface DialogProps extends DialogConfirmedProps {
  shown: boolean,
  setShown: React.Dispatch<React.SetStateAction<boolean>>,
}

// necessary when a component need multiple Dialogs
export interface ShownDialogProps extends DialogConfirmedProps {
  shownSubmitDialog: boolean,
  setShownSubmitDialog: React.Dispatch<React.SetStateAction<boolean>>,
  shownConfirmDialog: boolean,
  setShownConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>,

}

