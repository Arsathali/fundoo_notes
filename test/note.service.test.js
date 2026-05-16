import { expect } from 'chai';
import sinon from 'sinon';
import * as noteService from '../src/service/note.service.js';
import Note from '../src/model/note.model.js';
import Label from '../src/model/label.model.js';
import AppError from '../src/utils/AppError.js';

describe('Note Service', () => {
  let noteStub, labelStub;

  beforeEach(() => {
    noteStub = sinon.stub(Note);
    labelStub = sinon.stub(Label);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createNoteService', () => {
    it('should create a note successfully', async () => {
      const data = { content: 'Test note content', title: 'Test Title' };
      const userId = 'userId';
      const createdNote = { ...data, userId, _id: 'noteId' };

      noteStub.create.resolves(createdNote);

      const result = await noteService.createNoteService(data, userId);

      expect(noteStub.create.calledWith({
        title: 'Test Title',
        content: 'Test note content',
        userId,
        labelId: [],
        isPinned: false,
        isArchived: false,
        isDeleted: false,
        color: '#ffffff',
        reminder: null
      })).to.be.true;
      expect(result).to.equal(createdNote);
    });

    it('should throw error if content is missing', async () => {
      const data = { title: 'Test Title' };
      const userId = 'userId';

      try {
        await noteService.createNoteService(data, userId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.equal('Content is required');
        expect(error.statusCode).to.equal(400);
      }
    });

    it('should handle labels correctly', async () => {
      const data = { content: 'Test note', labels: ['label1', 'label2'] };
      const userId = 'userId';
      const label1 = { _id: 'label1Id', name: 'label1', userId };
      const label2 = { _id: 'label2Id', name: 'label2', userId };
      const createdNote = { ...data, userId, labelId: ['label1Id', 'label2Id'], _id: 'noteId' };

      labelStub.findOne.onFirstCall().resolves(null);
      labelStub.create.onFirstCall().resolves(label1);
      labelStub.findOne.onSecondCall().resolves(null);
      labelStub.create.onSecondCall().resolves(label2);
      noteStub.create.resolves(createdNote);

      const result = await noteService.createNoteService(data, userId);

      expect(labelStub.findOne.calledWith({ name: 'label1', userId })).to.be.true;
      expect(labelStub.create.calledWith({ name: 'label1', userId })).to.be.true;
      expect(result.labelId).to.deep.equal(['label1Id', 'label2Id']);
    });
  });

  describe('getAllNotesService', () => {
    it('should return all notes for user', async () => {
      const userId = 'userId';
      const notes = [{ content: 'Note 1' }, { content: 'Note 2' }];

      noteStub.find.resolves(notes);

      const result = await noteService.getAllNotesService(userId);

      expect(noteStub.find.calledWith({ userId, isDeleted: false })).to.be.true;
      expect(result).to.equal(notes);
    });
  });

  describe('getSingleNoteService', () => {
    it('should return a single note', async () => {
      const noteId = 'noteId';
      const userId = 'userId';
      const note = { content: 'Single note' };

      noteStub.findOne.resolves(note);

      const result = await noteService.getSingleNoteService(noteId, userId);

      expect(noteStub.findOne.calledWith({ _id: noteId, userId, isDeleted: false })).to.be.true;
      expect(result).to.equal(note);
    });
  });

  describe('updateNoteService', () => {
    it('should update a note', async () => {
      const noteId = 'noteId';
      const userId = 'userId';
      const data = { title: 'Updated Title' };
      const updatedNote = { _id: noteId, title: 'Updated Title' };

      noteStub.findOneAndUpdate.resolves(updatedNote);

      const result = await noteService.updateNoteService(noteId, userId, data);

      expect(noteStub.findOneAndUpdate.calledWith(
        { _id: noteId, userId, isDeleted: false },
        data,
        { new: true }
      )).to.be.true;
      expect(result).to.equal(updatedNote);
    });
  });

  describe('deleteNoteService', () => {
    it('should soft delete a note', async () => {
      const noteId = 'noteId';
      const userId = 'userId';
      const deletedNote = { _id: noteId, isDeleted: true };

      noteStub.findOneAndUpdate.resolves(deletedNote);

      const result = await noteService.deleteNoteService(noteId, userId);

      expect(noteStub.findOneAndUpdate.calledWith(
        { _id: noteId, userId, isDeleted: false },
        { isDeleted: true },
        { new: true }
      )).to.be.true;
      expect(result).to.equal(deletedNote);
    });
  });

  describe('togglePinService', () => {
    it('should toggle pin status', async () => {
      const noteId = 'noteId';
      const userId = 'userId';
      const note = { _id: noteId, isPinned: false, save: sinon.stub().resolvesThis() };

      noteStub.findOne.resolves(note);

      const result = await noteService.togglePinService(noteId, userId);

      expect(note.isPinned).to.be.true;
      expect(note.save.called).to.be.true;
      expect(result).to.equal(note);
    });
  });
});