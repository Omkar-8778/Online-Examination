import React, { useState, useEffect, useRef } from 'react';
import { FaClone } from 'react-icons/fa';
import {
    picEmptyProfile,
    plusImg,
    BG1,
    BG2,
    BG3,
    BG4,
    BG5,
    BG6,
} from '../res/resIndex';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';

const DashboardTr = (params) => {
    const [courses, setCourses] = useState([]);
    const [createButtonClicked, setcreateButtonClicked] = useState(false);
    const getCourses = () => {
        fetch(`${process.env.REACT_APP_BASE_URI}/api/course`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${JSON.parse(
                    localStorage.getItem('token')
                )}`,
            },
        })
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                setCourses(data);
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        getCourses();
    }, []);
    return (
        <>
            <PopUp
                setcreateButtonClicked={setcreateButtonClicked}
                clicked={createButtonClicked}
                getCourses={getCourses}
            />
            <div className='body-container'>
                <div className='r1'>
                    <InfoCard user={params.user} />
                    <div className='r1-card'>Upcoming Tests</div>
                    <div className='r1-card'>Search bar</div>
                </div>

                <h1 className='heading-sep'>Courses :</h1>

                <div className='r2'>
                    {courses.map((course) => {
                        return (
                            <CourseCards
                                key={course._id}
                                courseCode={course.course_code}
                                courseName={course.course_name}
                            />
                        );
                    })}
                </div>
                <CreateButton
                    createButtonClicked={createButtonClicked}
                    setcreateButtonClicked={setcreateButtonClicked}
                />
            </div>
        </>
    );
};

const CourseCards = (params) => {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const randomBG = (code) => {
        var str = 'BG' + ((code.charCodeAt(0) % 6) + 1);
        switch (str) {
            case 'BG1':
                return BG1;
            case 'BG2':
                return BG2;
            case 'BG3':
                return BG3;
            case 'BG4':
                return BG4;
            case 'BG5':
                return BG5;
            case 'BG6':
                return BG6;
            default:
                return BG3;
        }
    };
    const showCopied = () => {
        const label = document.querySelector(`#${params.courseCode}`);
        label.style.display = 'inline-block';
        setTimeout(() => (label.style.display = 'none'), 1000);
    };
    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/${params.courseCode}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
            }
        )
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                setTests(data);

                setIsLoading(false);
            });
    }, []);
    return (
        <div className='r2-card'>
            <div
                className='r-card-top'
                style={{
                    backgroundImage: `url(${randomBG(params.courseCode)})`,
                    backgroundSize: 'cover',
                }}
            >
                <Link to={`/c/${params.courseCode}`}>
                    <span>{params.courseName}</span>
                </Link>
                <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>
                    {params.courseCode}
                    <CopyToClipboard
                        text={params.courseCode}
                        onCopy={() => showCopied()}
                    >
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                marginLeft: '0.7rem',
                                marginTop: '0.3rem',
                                cursor: 'pointer',
                            }}
                        >
                            <FaClone />
                        </button>
                    </CopyToClipboard>
                    <div className='copied-label' id={params.courseCode}>
                        Copied
                    </div>
                </span>
            </div>
            <div className='r-card-bottom'>
                <ul>
                    {isLoading ? (
                        <h2>Loading...</h2>
                    ) : tests.length === 0 ? (
                        <li>
                            <button className='btn btn-primary'>
                                Create test
                            </button>
                        </li>
                    ) : (
                        tests.map((test) => {
                            return (
                                <li key={test.test_name}>
                                    <a href='/#'>{test.test_name}</a>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
        </div>
    );
};

const InfoCard = ({ user }) => {
    return (
        <div className='r1-card'>
            <div className='r-card-top'>
                <img alt='img' src={picEmptyProfile} />
                <span>{user.name}</span>
            </div>
            <div className='r-card-bottom'>
                <span>Role : {user.role}</span>
                <span>Email : {user.email}</span>
            </div>
        </div>
    );
};

const CreateButton = (params) => {
    return (
        <button
            onClick={(e) => {
                params.setcreateButtonClicked(!params.createButtonClicked);
            }}
            className='create-btn'
        >
            <img src={plusImg} alt='+' />
        </button>
    );
};

const PopUp = (props) => {
    const courseName = useRef(null);
    function onSubmitHandle(e) {
        e.preventDefault();
        try {
            if (courseName.current.value !== null)
                fetch(`${process.env.REACT_APP_BASE_URI}/api/course/new`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `bearer ${JSON.parse(
                            localStorage.getItem('token')
                        )}`,
                    },
                    body: JSON.stringify({
                        courseName: courseName.current.value,
                    }),
                })
                    .then((data, err) => {
                        if (!err) return data.json();
                        else console.log(err);
                    })
                    .then((data) => {
                        if (data.ok) {
                            props.getCourses();
                            props.setcreateButtonClicked(false);
                            console.log('Course successfully created');
                        }
                    });
        } catch (err) {
            console.log(err);
        }
    }

    if (props.clicked) {
        return (
            <>
                <div className='popup-container'>
                    <form className='popup-form' onSubmit={onSubmitHandle}>
                        <input
                            className='popup-input'
                            type='text'
                            placeholder='Enter course name'
                            required
                            ref={courseName}
                            autoFocus
                        />
                        <button type='submit' className='popup-btn'>
                            Create
                        </button>
                    </form>
                </div>
            </>
        );
    } else {
        return null;
    }
};
export default DashboardTr;
