'use strict';

var graphqlTools = require('graphql-tools');

var doc = {"kind":"Document","definitions":[{"kind":"InterfaceTypeDefinition","name":{"kind":"Name","value":"Node"},"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"User"},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"Node"}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"handle"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"me"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Node"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"Profile"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"handle"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"profile"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"profile"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeHandle"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"handle"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"pass"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"word"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteAccount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"SchemaDefinition","directives":[],"operationTypes":[{"kind":"OperationTypeDefinition","operation":"query","type":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}}},{"kind":"OperationTypeDefinition","operation":"mutation","type":{"kind":"NamedType","name":{"kind":"Name","value":"Mutation"}}}]}],"loc":{"start":0,"end":446}};
    doc.loc.source = {"body":"interface Node {\n  id: ID!\n}\n\ntype User implements Node {\n  id: ID!\n  handle: String\n}\n\ntype Query {\n  me: User\n  node(id: ID!): Node\n}\n\ninput Profile {\n  handle: String!\n  password: String!\n}\n\ntype Mutation {\n  signup(profile: Profile!): User\n  login(profile: Profile!): User\n  changeHandle(handle: String!): User\n  changePassword(pass: String!, word: String!): Boolean\n  deleteAccount: Boolean\n}\n\nschema {\n  query: Query\n  mutation: Mutation\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};

var Node = {
  __resolveType(_) {
    return _.__typename;
  },
};

var User = {};

const models = require('./models');

const { User: User$1 } = models;
var Query = {
  me(_) {
    const { user = null } = _;
    return user && User$1.findUserById(user);
  },
  node(_, args) {
    const { id, type = 'User' } = args;
    switch (type) {
      default:
        return null;
      case 'User':
        return User$1.findUserById(id);
    }
  },
};

const { User: User$2 } = models;
var Mutation = {
  async login(_, args) {
    const { profile } = args;
    const user = await User$2.login(profile);
    return user;
  },
  async signup(_, args) {
    const { profile } = args;
    const user = await User$2.createUser(profile);
    return user;
  },
  async changeHandle(_, args) {
    const { handle } = args;
    const user = await User$2.changeHandle(_.user, handle);
    return user;
  },
  async changePassword(_, args) {
    const { pass, word } = args;
    const user = await User$2.changePassword(_.user, pass, word);
    return !!user;
  },
  async deleteAccount(_) {
    const user = await User$2.deleteAccount(_.user);
    return !!user;
  },
};

const resolvers = {
  Node,
  User,
  Query,
  Mutation,
};

const schema = graphqlTools.makeExecutableSchema({
  typeDefs: [doc],
  resolvers,
});

module.exports = schema;
