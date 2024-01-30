import DialogAlert, { DialogAlertProps } from './DialogAlert'

type DialogAlertDeleteProps = Omit<DialogAlertProps, 'message'>

export default function DialogAlertDelete(props: DialogAlertDeleteProps) {
  return <DialogAlert {...props} message="Deseja realmente deletar?" />
}
