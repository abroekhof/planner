import Foods from '../foods';

// create a full text search index for Food name
Foods._ensureIndex({
  name: 'text',
});
