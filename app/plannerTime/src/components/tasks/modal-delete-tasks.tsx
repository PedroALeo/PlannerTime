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
import { Task } from '@/interfaces/tasks'
import { useDeleteTaskMutation } from '@/store/services/apiSlice'
import { toast } from 'sonner'

interface ModalDeleteTasksProps {
  taskToDelete: Task | null
  setTaskToDelete: React.Dispatch<React.SetStateAction<Task | null>>
}
export default function ModalDeleteTasks({
  taskToDelete,
  setTaskToDelete,
}: ModalDeleteTasksProps) {
  const email = localStorage.getItem('email')
  const [deleteTask] = useDeleteTaskMutation()

  const handleDeleteTask = async () => {
    try {
      await deleteTask({
        email: email || '',
        taskId: taskToDelete?.id || 0,
      }).unwrap()
      setTaskToDelete(null)
      toast.success('Tarefa deletada com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
      toast.error('Erro ao deletar tarefa. Por favor, tente novamente.')
    }
  }

  return (
    <AlertDialog
      open={!!taskToDelete}
      onOpenChange={() => setTaskToDelete(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a
            tarefa "{taskToDelete?.name}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTask}
            className='bg-red-600 hover:bg-red-700'
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
