import css from './Delete.module.scss';

interface DeleteConfirmationModalProps {
  subject: string;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const DeleteConfirmationModal = ({
  subject,
  onSubmit,
  onClose,
}: DeleteConfirmationModalProps) => {
  return (
    <>
      <p>Delete this {subject}?</p>
      <form className={css.confirmModal} onSubmit={onSubmit}>
        <button type="submit" onClick={() => false}>
          Yes
        </button>
        <button type="button" onClick={onClose}>
          No
        </button>
      </form>
    </>
  );
};
