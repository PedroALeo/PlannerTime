import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Restriction } from '@/interfaces/restriction'
import { useDeleteRestrictionMutation } from '@/store/services/apiSlice'
import { toast } from 'sonner'

interface ModalDeleteRestrictionsProps {
  restrictionToDelete: Restriction | null
  setRestrictionToDelete: React.Dispatch<
    React.SetStateAction<Restriction | null>
  >
}

export default function ModalDeleteRestrictions({
  restrictionToDelete,
  setRestrictionToDelete,
}: ModalDeleteRestrictionsProps) {
  const email = localStorage.getItem('email')
  const [deleteRestriction] = useDeleteRestrictionMutation()

  const handleDeleteRestriction = async () => {
    try {
      await deleteRestriction({
        email: email || '',
        restrictionId: restrictionToDelete?.id || 0,
      }).unwrap()
      setRestrictionToDelete(null)
      toast.success('Restrição deletada com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar restrição:', error)
      toast.error('Erro ao deletar restrição. Por favor, tente novamente.')
    }
  }
  return (
    <AlertDialog
      open={!!restrictionToDelete}
      onOpenChange={() => setRestrictionToDelete(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a
            restrição "{restrictionToDelete?.name}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteRestriction}
            className='bg-red-600 hover:bg-red-700'
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
