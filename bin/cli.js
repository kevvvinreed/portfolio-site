#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const run = cmd => {
  try {
    execSync(`${cmd}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${cmd}`, e);
    return false;
  }
  return true;
};

const repo_name = process.argv[2] ? process.argv[2] : '.';
const git_checkout_command = `git clone --depth 1 https://github.com/kevvvinreed/next-boilerplate ${repo_name}`;
const install_dependencies_command = `cd ${repo_name} && yarn`;

console.log(`Cloning the repository with name ${repo_name}`);
const checked_out = run(git_checkout_command);
if (!checked_out) process.exit(-1);

// Handle Git repository setup
const projectPath = path.join(process.cwd(), repo_name);
const gitDir = path.join(projectPath, '.git');

if (fs.existsSync(gitDir)) {
  console.log('Setting up Git repository...');
  
  // Check if this is a fresh clone or existing repo
  try {
    const remoteOutput = execSync(`cd ${repo_name} && git remote -v`, { encoding: 'utf8' });
    
    if (remoteOutput.includes('next-boilerplate')) {
      console.log('Removing remote origin to prevent linking to boilerplate repo...');
      run(`cd ${repo_name} && git remote remove origin`);
      
      // Initialize as a fresh repository
      console.log('Initializing as fresh repository...');
      run(`cd ${repo_name} && git add . && git commit -m "Initial commit from boilerplate"`);
    } else {
      console.log('Repository already has custom remotes, preserving existing setup...');
    }
  } catch (error) {
    // If git remote fails, it might be a fresh clone
    console.log('Initializing new Git repository...');
    run(`cd ${repo_name} && git init`);
    run(`cd ${repo_name} && git add . && git commit -m "Initial commit from boilerplate"`);
  }
} else {
  // No .git directory exists, initialize new repository
  console.log('Initializing new Git repository...');
  run(`cd ${repo_name} && git init`);
  run(`cd ${repo_name} && git add . && git commit -m "Initial commit from boilerplate"`);
}

console.log(`Installing dependencies for ${repo_name}`);
const installed_dependencies = run(install_dependencies_command);
if (!installed_dependencies) process.exit(-1);

console.log(`Boilerplate successfully installed!`);
console.log(`Your new project is ready at: ${projectPath}`);
console.log(`To start development: cd ${repo_name} && yarn dev`);
