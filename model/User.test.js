const mongoose = require('mongoose');
const User = require('./User');

describe('User model schema validation', () => {
  it('requires name, email, and password', () => {
    const u = new User();
    const err = u.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('defaults role to parent when not provided', () => {
    const u = new User({ name: 'Parent', email: 'p@test.com', password: 'secret' });
    const err = u.validateSync();
    // no validation errors
    expect(err).toBeUndefined();
    expect(u.role).toBe('parent');
  });

  it('requires parentId for child role', () => {
    const u = new User({ name: 'Child', email: 'c@test.com', password: 'secret', role: 'child' });
    const err = u.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.parentId).toBeDefined();
  });

  it('accepts parentId when role is child', () => {
    const fakeId = new mongoose.Types.ObjectId();
    const u = new User({ name: 'Child', email: 'c2@test.com', password: 'secret', role: 'child', parentId: fakeId });
    const err = u.validateSync();
    expect(err).toBeUndefined();
    expect(u.parentId.toString()).toBe(fakeId.toString());
  });

  it('allows manager creation without teamId (team is auto-created on signup)', () => {
    const u = new User({ name: 'Manager', email: 'm@test.com', password: 'secret', role: 'manager' });
    const err = u.validateSync();
    expect(err).toBeUndefined();
    expect(u.teamId).toBeUndefined();
  });

  it('accepts teamId when role is manager', () => {
    const fakeId = new mongoose.Types.ObjectId();
    const u = new User({ name: 'Manager', email: 'm2@test.com', password: 'secret', role: 'manager', teamId: fakeId });
    const err = u.validateSync();
    expect(err).toBeUndefined();
    expect(u.teamId.toString()).toBe(fakeId.toString());
  });

  it('children defaults to empty array when not provided', () => {
    const u = new User({ name: 'Parent2', email: 'p2@test.com', password: 'secret' });
    const err = u.validateSync();
    expect(err).toBeUndefined();
    expect(Array.isArray(u.children)).toBe(true);
  });
});
