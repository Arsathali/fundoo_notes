import { expect } from 'chai';
import sinon from 'sinon';
import * as labelService from '../src/service/label.service.js';
import Label from '../src/model/label.model.js';
import Note from '../src/model/note.model.js';

describe('Label Service', () => {
  let labelStub, noteStub;

  beforeEach(() => {
    labelStub = sinon.stub(Label);
    noteStub = sinon.stub(Note);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createLabelService', () => {
    it('should create a label', async () => {
      const name = 'Test Label';
      const userId = 'userId';
      const createdLabel = { name, userId, _id: 'labelId' };

      labelStub.create.resolves(createdLabel);

      const result = await labelService.createLabelService(name, userId);

      expect(labelStub.create.calledWith({ name, userId })).to.be.true;
      expect(result).to.equal(createdLabel);
    });
  });

  describe('updateLabelService', () => {
    it('should update a label', async () => {
      const labelId = 'labelId';
      const userId = 'userId';
      const name = 'Updated Label';
      const updatedLabel = { _id: labelId, name, userId };

      labelStub.findOneAndUpdate.resolves(updatedLabel);

      const result = await labelService.updateLabelService(labelId, userId, name);

      expect(labelStub.findOneAndUpdate.calledWith(
        { _id: labelId, userId },
        { name },
        { new: true }
      )).to.be.true;
      expect(result).to.equal(updatedLabel);
    });
  });

  describe('getLabelsService', () => {
    it('should return all labels for user', async () => {
      const userId = 'userId';
      const labels = [{ name: 'Label 1' }, { name: 'Label 2' }];

      labelStub.find.resolves(labels);

      const result = await labelService.getLabelsService(userId);

      expect(labelStub.find.calledWith({ userId })).to.be.true;
      expect(result).to.equal(labels);
    });
  });

  describe('deleteLabelService', () => {
    it('should delete a label and remove from notes', async () => {
      const userId = 'userId';
      const labelId = 'labelId';
      const deletedLabel = { _id: labelId };

      noteStub.updateMany.resolves();
      labelStub.findOneAndDelete.resolves(deletedLabel);

      const result = await labelService.deleteLabelService(userId, labelId);

      expect(noteStub.updateMany.calledWith(
        { userId, labelId },
        { $pull: { labelId: labelId } }
      )).to.be.true;
      expect(labelStub.findOneAndDelete.calledWith({ _id: labelId, userId })).to.be.true;
      expect(result).to.equal(deletedLabel);
    });
  });

  describe('getNotesByLabelService', () => {
    it('should return notes by label', async () => {
      const userId = 'userId';
      const labelId = 'labelId';
      const notes = [{ content: 'Note with label' }];

      noteStub.find.resolves(notes);

      const result = await labelService.getNotesByLabelService(userId, labelId);

      expect(noteStub.find.calledWith({ userId, labelId: labelId })).to.be.true;
      expect(result).to.equal(notes);
    });
  });
});